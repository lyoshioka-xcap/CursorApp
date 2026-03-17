import { useLiveQuery } from "dexie-react-hooks";
import { db, type Visit } from "../db";

export function useVisits() {
  const visits = useLiveQuery(() => db.visits.toArray());

  const addVisit = async (visit: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await db.visits.add({
      ...visit,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Visit);
  };

  const updateVisit = async (id: number, visit: Partial<Visit>) => {
    return await db.visits.update(id, {
      ...visit,
      updatedAt: new Date(),
    });
  };

  const deleteVisit = async (id: number) => {
    return await db.visits.delete(id);
  };

  const getVisitByPrefecture = (prefectureId: number) => {
    return visits?.find((v) => v.prefectureId === prefectureId);
  };

  return {
    visits,
    addVisit,
    updateVisit,
    deleteVisit,
    getVisitByPrefecture,
  };
}
