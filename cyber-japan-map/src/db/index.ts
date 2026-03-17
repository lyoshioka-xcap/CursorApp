import Dexie, { type EntityTable } from 'dexie';

export interface Visit {
  id?: number;
  prefectureId: number;
  date: Date;
  memo: string;
  rating: number;
  photo?: Blob;
  createdAt: Date;
  updatedAt: Date;
}

const db = new Dexie('CyberJapanMapDB') as Dexie & {
  visits: EntityTable<Visit, 'id'>;
};

db.version(1).stores({
  visits: '++id, prefectureId, date, rating'
});

export { db };
