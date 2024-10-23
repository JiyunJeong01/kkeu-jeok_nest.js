import { Injectable } from '@nestjs/common';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase/fbase';

@Injectable()
export class MemoService {

    // 특정 유저의 모든 메모 찾기
    async findByUserId(userId: string): Promise<any[]> {
        try {
            // 'memos' 컬렉션에서 특정 userID를 가진 게시글만 가져옴
            const querySnapshot = await getDocs(
                query(
                    collection(db, 'memos'),
                    where('userId', '==', userId),
                    orderBy('createdAt', 'desc')));

            // 각 게시글과 관련된 파일 정보를 포함한 배열 반환
            const memos = await Promise.all(querySnapshot.docs.map(async (memo) => {
                const files = await this.getFilesByMemoId(memo.id);
                return {
                    id: memo.id,
                    ...memo.data(),
                    files: files,
                };
            }));

            return memos;
        } catch (error) {
            console.error("findByUserId 실행 중 오류:", error);
            throw error;
        }
    }

    // 특정 메모의 파일 정보 로딩
    private async getFilesByMemoId(memoId: string): Promise<any[]> {
        try {
            const filesCollectionRef = collection(db, 'files');
            const q = query(filesCollectionRef, where('memoId', '==', memoId), orderBy('index'));
            const querySnapshot = await getDocs(q);

            const files = [];
            querySnapshot.forEach((doc) => {
                files.push({
                    fileId: doc.id,
                    fileName: doc.data().fileName,
                    type: doc.data().type,
                    uuid: doc.data().uuid,
                    index: doc.data().index,
                    downloadURL: doc.data().downloadURL,
                });
            });

            return files;
        } catch (error) {
            console.error("파일 가져오기 중 오류:", error);
            throw error;
        }
    }
}
