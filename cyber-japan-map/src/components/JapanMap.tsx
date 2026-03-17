"use client";

import Japan from "@react-map/japan";
import { useVisits } from "@/hooks/useVisits";
import { useEffect, useState } from "react";
import { getPrefectureCode, getPrefectureId, getPrefectureName } from "@/data/prefectures";

interface JapanMapProps {
  onSelectPrefecture: (id: number, name: string) => void;
}

export function JapanMap({ onSelectPrefecture }: JapanMapProps) {
  const { visits } = useVisits();
  const [cityColors, setCityColors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visits) {
      const colors: Record<string, string> = {};
      visits.forEach((visit) => {
        const code = getPrefectureCode(visit.prefectureId);
        if (code) {
          colors[code] = "#ff00ff"; 
        }
      });
      setCityColors(colors);
    }
  }, [visits]);

  const handleSelect = (state: string | null) => {
    if (state) {
      const id = getPrefectureId(state);
      const name = getPrefectureName(id);
      if (id > 0) {
        onSelectPrefecture(id, name);
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center relative p-4">
      <div className="w-full max-w-[800px] aspect-[4/3]">
        <Japan
          type="select-single"
          size={800}
          mapColor="#1a1a1a"
          strokeColor="#00f3ff"
          strokeWidth={0.5}
          hoverColor="#00f3ff"
          selectColor="#ff00ff"
          onSelect={handleSelect}
          cityColors={cityColors}
          hints={true}
          hintTextColor="#00f3ff"
          hintBackgroundColor="#050505"
          hintPadding="8px"
          hintBorderRadius={4}
        />
      </div>
    </div>
  );
}
