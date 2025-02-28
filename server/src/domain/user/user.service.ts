import { Injectable } from '@nestjs/common';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase/fbase';
import { smtpTransport } from '../../etc/email';

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
}
