import { Injectable } from '@nestjs/common';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase/fbase';

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
}