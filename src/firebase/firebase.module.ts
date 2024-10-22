import { Module } from '@nestjs/common';
import { db, storage } from './fbase';

@Module({
  providers: [
    {
      provide: 'FIREBASE_DB',
      useValue: db,
    },
    {
      provide: 'FIREBASE_STORAGE',
      useValue: storage,
    },
  ],
  exports: ['FIREBASE_DB', 'FIREBASE_STORAGE'],
})
export class FirebaseModule {}
