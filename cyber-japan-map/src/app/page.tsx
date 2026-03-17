"use client";

import { useState } from "react";
import { JapanMap } from "@/components/JapanMap";
import { PrefectureModal } from "@/components/PrefectureModal";
import { useVisits } from "@/hooks/useVisits";

export default function Home() {
  const [selectedPrefecture, setSelectedPrefecture] = useState<{ id: number; name: string } | null>(null);
  const { visits } = useVisits();

  const totalPrefectures = 47;
  const visitedCount = visits?.length || 0;
  const progress = (visitedCount / totalPrefectures) * 100;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

      {/* Header */}
      <header className="z-10 w-full max-w-4xl flex justify-between items-end mb-8 border-b border-neon-cyan/30 pb-4">
        <div>
          <h1 className="text-4xl font-bold text-glow-cyan mb-2 tracking-wider">CYBER JAPAN MAP</h1>
          <p className="text-gray-400 text-sm">全国制覇ロードマップ // SYSTEM ONLINE</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-neon-magenta">{visitedCount} / {totalPrefectures}</div>
          <div className="text-xs text-gray-500">CONQUERED</div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full max-w-4xl h-2 bg-gray-800 rounded-full mb-8 overflow-hidden box-glow-cyan">
        <div
          className="h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]"
          style={{ width: `${progress}%`, transition: "width 1s ease-in-out" }}
        ></div>
      </div>

      {/* Map */}
      <div className="w-full flex-1 flex items-center justify-center z-10">
        <JapanMap
          onSelectPrefecture={(id, name) => setSelectedPrefecture({ id, name })}
        />
      </div>

      {/* Modal */}
      <PrefectureModal
        prefectureId={selectedPrefecture?.id || 0}
        prefectureName={selectedPrefecture?.name || ""}
        isOpen={!!selectedPrefecture}
        onClose={() => setSelectedPrefecture(null)}
      />

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-600 text-xs">
        © 2026 CYBER JAPAN MAP PROJECT
      </footer>
    </main>
  );
}
