import { Injectable } from '@nestjs/common';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db, storage } from '../../firebase/fbase';
import { smtpTransport } from '../../etc/email';
import { deleteObject, ref } from 'firebase/storage';

@Injectable()
export class UserService {
  async getUserByEmail(email: string): Promise<any | null> { // Promise<any | null>로 반환 타입 설정
    try {
      // 'users' 컬렉션에서 특정 emila을 가진 유저만 가져옴
      const querySnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', email)));

      // 문서가 존재하지 않는 경우 null 반환
      if (querySnapshot.empty) {
        return null;
      }

      const user = querySnapshot.docs[0].data();
      const userData = {
        id: querySnapshot.docs[0].id,
        ...user
      };

      return userData;
    } catch (error) {
      console.log("getUserByEmail 실행 중 오류:", error);
      throw error;
    }
  }

  async sendAuthEmail(email: string): Promise<number> {
    const number = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

    const mailOptions = {
      from: "stopyun0101@naver.com",
      to: email,
      subject: "인증 관련 메일 입니다.",
      html: `<h1>인증번호를 입력해주세요</h1><br>${number}`,
    };

    return new Promise((resolve, reject) => {
      smtpTransport.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('메일 전송 에러:', err);
          reject(new Error('메일 전송에 실패하였습니다.')); // 실패 시 reject
        } else {
          console.log('메일 전송 성공:', response);
          resolve(number); // 성공 시 인증번호 반환
        }
      });
    });
  }

  async createAccount(email: string, name: string, password: string): Promise<string> {
    try {
      const timestamp = new Date(); // 현재 타임스탬프

      // 새로운 유저 객체 생성
      const userData = {
        email,
        name,
        password,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      // 'users' 컬렉션에 새로운 유저 문서 추가
      const docRef = await addDoc(collection(db, 'users'), userData);

      console.log("유저가 추가되었습니다. ID:", docRef.id);

      return docRef.id; // 새로 추가된 유저의 ID 반환
    } catch (error) {
      console.error("유저 추가 중 오류:", error);
      throw error;
    }
  }

  // 유저 ID로 얻기
  async getUserById(userId: string): Promise<any | null> {
    try {
      // 'users' 컬렉션에서 userId와 일치하는 사용자 문서 가져오기
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists) {
        throw new Error('해당 userId를 가진 사용자를 찾을 수 없습니다.');
      }

      // 사용자 정보 반환
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error('사용자 정보 조회 중 오류:', error);
      throw error;
    }
  }

  // 패스워드 변경
  async changePassword(userId: string, hashedPassword: string) {
    const userRef = doc(db, 'users', userId);

    // 해당 사용자 문서 업데이트
    await updateDoc(userRef, {
      password: hashedPassword
    });
    return true;
  }

  // 사용자 삭제
  async deleteUser(userId: string) {
    // 메모 삭제 및 파일 삭제
    try {
      // userId와 일치하는 메모들을 쿼리
      const querySnapshot = await getDocs(
        query(
          collection(db, 'memos'),
          where('userId', '==', userId)));

      // 쿼리 결과가 비어있으면 아무 작업도 하지 않음
      if (querySnapshot.empty) {
        return null;
      }

      // 삭제된 메모들의 memoId 배열
      const memoIds = [];

      // 모든 메모를 삭제
      const deletionPromises = querySnapshot.docs.map(async (memo) => {
        const memoId = memo.id;
        const memoRef = doc(db, 'memos', memoId);
        await deleteDoc(memoRef);
        memoIds.push(memoId);
      });

      // 모든 삭제 작업을 기다림
      await Promise.all(deletionPromises);

      const deletionPromises2 = [];

      // 각 memoId에 대해 파일 삭제 작업 수행
      for (const memoId of memoIds) {
        // 메모와 관련된 파일 정보 가져오기
        const files = await exports.getFilesByMemoId(memoId);

        // Firebase Storage에서 파일 삭제
        const deleteStoragePromises = files.map(async (file) => {
          const fileRef = ref(storage, `${userId}/${file.uuid}_${file.fileName}`);
          await deleteObject(fileRef);
        });
        deletionPromises2.push(Promise.all(deleteStoragePromises));

        // Firestore에서 파일 문서 삭제
        const filesCollectionRef = collection(db, 'files');
        const q = query(filesCollectionRef, where('memoId', '==', memoId));
        const querySnapshot = await getDocs(q);
        const deleteFileDocsPromises = querySnapshot.docs.map(async (doc) => {
          await deleteDoc(doc.ref);
        });
        deletionPromises2.push(Promise.all(deleteFileDocsPromises));
      }

      // 모든 삭제 작업을 기다림
      await Promise.all(deletionPromises2);
    } catch (error) {
      console.error('메모 삭제 중 오류:', error);
      throw error;
    }

    // 사용자 삭제
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      return userId;
    } catch (error) {
      console.error('유저 삭제 중 오류', error);
      throw error;
    }
  }
}
