import { useEffect, useRef, useState } from 'react';
import { loadDomIndexesForMonth } from '../services/domMapTimelineService';
import DomMapSvg from './DomMapSvg';

const MONTHS = ['2025-11', '2025-12', '2026-01'];

export default function DomMapTimeline() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, number>>({});
  const [playing, setPlaying] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Chargement des données à chaque pas
  useEffect(() => {
    let alive = true;

    loadDomIndexesForMonth(MONTHS[step]).then((data) => {
      if (!alive) return;

      const map: Record<string, number> = {};
      data.forEach((d) => (map[d.territory] = d.index));
      setValues(map);
    });

    return () => {
      alive = false;
    };
  }, [step]);

  // Lecture automatique
  useEffect(() => {
    if (!playing) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setStep((prev) => (prev + 1) % MONTHS.length);
    }, 1600);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [playing]);

  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">
          Carte du surcoût — {MONTHS[step]}
        </h2>

        <button
          onClick={() => setPlaying((p) => !p)}
          className="px-3 py-1 rounded-md text-sm bg-white/10 hover:bg-white/20"
        >
          {playing ? '⏸ Pause' : '▶︎ Lecture'}
        </button>
      </div>

      <DomMapSvg values={values} />

      <input
        type="range"
        min={0}
        max={MONTHS.length - 1}
        value={step}
        onChange={(e) => {
          setStep(Number(e.target.value));
          setPlaying(false);
        }}
        className="w-full mt-4"
      />
    </div>
  );
}