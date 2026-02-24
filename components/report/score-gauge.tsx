"use client";

import { useEffect, useRef, useState } from "react";
import type { ScoreResult } from "@/lib/score";

interface ScoreGaugeProps {
  result: ScoreResult;
  size?: number;
}

const GRADE_COLORS: Record<ScoreResult["grade"], string> = {
  good: "oklch(0.65 0.2 145)",
  "needs-work": "oklch(0.72 0.18 65)",
  poor: "oklch(0.55 0.22 25)",
};

const GRADE_BG_COLORS: Record<ScoreResult["grade"], string> = {
  good: "oklch(0.65 0.2 145 / 0.12)",
  "needs-work": "oklch(0.72 0.18 65 / 0.12)",
  poor: "oklch(0.55 0.22 25 / 0.12)",
};

export function ScoreGauge({ result, size = 160 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const target = result.score;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [result.score]);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - animatedScore / 100);

  const color = GRADE_COLORS[result.grade];
  const bgColor = GRADE_BG_COLORS[result.grade];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`アクセシビリティスコア: ${result.score}点 - ${result.label}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-bold tabular-nums leading-none"
          style={{ color }}
        >
          {animatedScore}
        </span>
        <span
          className="mt-1 text-xs font-medium"
          style={{ color }}
        >
          {result.label}
        </span>
      </div>
    </div>
  );
}
