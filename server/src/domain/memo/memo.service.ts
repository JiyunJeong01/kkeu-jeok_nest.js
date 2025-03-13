import { Injectable } from '@nestjs/common';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where, limit } from 'firebase/firestore';
import { db, storage } from '../../firebase/fbase';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';

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

    // 메모 생성
    async createMemo(userId: string, content: string, files?: Array<Express.Multer.File>): Promise<string> {
        try {
            const timestamp = new Date(); // 현재 타임스탬프
    
            // 새로운 메모 객체 생성
            const memoData = {
                userId,
                content,
                createdAt: timestamp,
                updatedAt: timestamp
            };
    
            // 'memos' 컬렉션에 새로운 메모 문서 추가
            const docRef = await addDoc(collection(db, 'memos'), memoData);
    
            if (files && files.length > 0) {
                await this.uploadFile(userId, docRef.id, files);
            }

            return docRef.id; // 새로 추가된 메모의 ID 반환
        } catch (error) {
            console.error("메모 추가 중 오류:", error);
            throw error;
        }
    }

    // 메모 생성시 파일 업로드 및 Firestore에 이미지 정보 저장
    private async uploadFile(userId: string, memoId: string, files: Array<Express.Multer.File>): Promise<void> {
        try {
            const filesQuery = query(
                collection(db, 'files'),
                where('memoId', '==', memoId),
                orderBy('index', 'desc'),
                limit(1)
            );

            const querySnapshot = await getDocs(filesQuery);
            let lastIndex = querySnapshot.empty ? 0 : querySnapshot.docs[0].data().index;

            await Promise.all(files.map(async (file, index) => {
                const fileName = Buffer.from(file.originalname, 'ascii').toString('utf8');
                const uuid = uuidv4();
                const fileRef = ref(storage, `${userId}/${uuid}_${fileName}`);
                
                await uploadBytes(fileRef, file.buffer);
                const downloadURL = await getDownloadURL(fileRef);

                const fileMetadata = {
                    memoId,
                    fileName,
                    type: file.mimetype,
                    uuid,
                    index: lastIndex + index + 1,
                    downloadURL,
                };

                await addDoc(collection(db, 'files'), fileMetadata);
            }));
        } catch (error) {
            console.error("파일 업로드 및 저장 중 오류:", error);
            throw error;
        }
    }

    // 메모 수정
    async modifiedMemo(userId: string, memoId: string, newContent: string, files?: Array<Express.Multer.File>, deleteFiles?: string[]): Promise<string> {
        try {
            const timestamp = new Date();
            const memoRef = doc(db, 'memos', memoId);
            // 업데이트할 데이터 객체 생성
            const updateData = {
                content: newContent,
                updatedAt: timestamp
            };
    
            // 해당 문서 업데이트
            await updateDoc(memoRef, updateData);
            if (files && files.length > 0) {
                await this.uploadFile(userId, memoId, files);
            }
            if (deleteFiles && deleteFiles.length > 0) {
                await this.deleteSelectFiles(userId, memoId, deleteFiles);
            }
            return memoId;
        } catch (error) {
            console.error('메모 수정 중 오류:', error);
            throw error;
        }
    }

    // 메모 수정 시 이미지 삭제
    private async deleteSelectFiles(userId: string, memoId: string, downloadURLs : string[]) {
        try {
            await Promise.all(downloadURLs.map(async (downloadURL) => {
                const fileSnapshot = await getDocs(
                    query(
                        collection(db, 'files'),
                        where('memoId', '==', memoId),
                        where('downloadURL', '==', downloadURL)
                    )
                );
    
                if (!fileSnapshot.empty) {
                    const fileDoc = fileSnapshot.docs[0];
                    const file = fileDoc.data();
    
                    const fileRef = ref(storage, `${userId}/${file.uuid}_${file.fileName}`);
                    await deleteObject(fileRef);
                    await deleteDoc(fileDoc.ref);
                }
            }));
        } catch (error) {
            console.error('이미지 삭제 중 오류:', error);
            throw error;
        }
    }

    // 메모 삭제
    async deleteMemo(userId: string, memoId: string) {
        try {
            const memoRef = doc(db, 'memos', memoId);
            await deleteDoc(memoRef);
            await this.deleteFiles(userId, memoId);
            return memoId;
        } catch (error) {
            console.error('메모 삭제 중 오류:', error);
            throw error;
        }
    }

    // 메모 삭제시 파일 같이 삭제
    private async deleteFiles(userId: string, memoId: string) {
        try {
            // 메모와 관련된 파일 정보 가져오기
            const files = await this.getFilesByMemoId(memoId);
    
            // Firebase Storage에서 파일 삭제
            const deletePromises = files.map(async (file) => {
                const fileRef = ref(storage, `${userId}/${file.uuid}_${file.fileName}`);
                await deleteObject(fileRef);
            });
            await Promise.all(deletePromises);
    
            // Firestore에서 파일 문서 삭제
            const filesCollectionRef = collection(db, 'files');
            const q = query(filesCollectionRef, where('memoId', '==', memoId));
            const querySnapshot = await getDocs(q);
            const deleteFileDocsPromises = [];
            querySnapshot.forEach((doc) => {
                deleteFileDocsPromises.push(deleteDoc(doc.ref));
            });
            await Promise.all(deleteFileDocsPromises);
        } catch (error) {
            console.error("메모와 파일 삭제 중 오류:", error);
            throw error;
        }
    }
}
