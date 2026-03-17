"use client";

import { useState, useEffect, useRef } from "react";
import { useVisits } from "@/hooks/useVisits";
import { Visit } from "@/db";
import { X, Upload, Trash2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PrefectureModalProps {
  prefectureId: number;
  prefectureName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PrefectureModal({ prefectureId, prefectureName, isOpen, onClose }: PrefectureModalProps) {
  const { getVisitByPrefecture, addVisit, updateVisit, deleteVisit, visits } = useVisits();
  const [visit, setVisit] = useState<Visit | undefined>(undefined);
  const [date, setDate] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && prefectureId) {
      const existingVisit = getVisitByPrefecture(prefectureId);
      setVisit(existingVisit);
      if (existingVisit) {
        setDate(existingVisit.date.toISOString().split('T')[0]);
        setMemo(existingVisit.memo);
        setRating(existingVisit.rating);
        setPhoto(existingVisit.photo || null);
        if (existingVisit.photo) {
          setPhotoUrl(URL.createObjectURL(existingVisit.photo));
        } else {
          setPhotoUrl(null);
        }
      } else {
        setDate(new Date().toISOString().split('T')[0]);
        setMemo("");
        setRating(0);
        setPhoto(null);
        setPhotoUrl(null);
      }
    }
  }, [isOpen, prefectureId, visits]);

  const handleSave = async () => {
    const visitData = {
      prefectureId,
      date: new Date(date),
      memo,
      rating,
      photo: photo || undefined,
    };

    if (visit?.id) {
      await updateVisit(visit.id, visitData);
    } else {
      await addVisit(visitData);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (visit?.id) {
      await deleteVisit(visit.id);
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-cyber-black border border-neon-cyan/50 rounded-lg p-6 w-full max-w-md shadow-[0_0_20px_rgba(0,243,255,0.2)]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-glow-cyan">{prefectureName}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">訪問日</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-cyber-gray border border-gray-700 rounded p-2 text-white focus:border-neon-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">評価</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                        rating >= r
                          ? "bg-neon-magenta border-neon-magenta text-black shadow-[0_0_10px_rgba(255,0,255,0.5)]"
                          : "border-gray-600 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">メモ</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                  className="w-full bg-cyber-gray border border-gray-700 rounded p-2 text-white focus:border-neon-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">写真</label>
                <div
                  className="border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-neon-cyan transition-colors min-h-[100px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoUrl ? (
                    <img src={photoUrl} alt="Visit" className="max-h-40 object-contain rounded" />
                  ) : (
                    <div className="text-gray-500 flex flex-col items-center">
                      <Upload size={24} />
                      <span className="text-xs mt-1">クリックしてアップロード</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                {visit?.id ? (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                    削除
                  </button>
                ) : (
                  <div></div>
                )}
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-neon-cyan text-black px-4 py-2 rounded hover:bg-cyan-400 font-bold shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all"
                >
                  <Save size={18} />
                  保存
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
