"use client";

import { useState, useEffect, useRef } from "react";
import { STEP_DURATIONS, steps } from "../usage-data";

export function useUsageTimer() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const remainingRef = useRef(STEP_DURATIONS[0]);
  const startTimeRef = useRef(Date.now());

  const stopTimer = () => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  const startTimer = (step: number, duration?: number) => {
    const stepDuration = duration ?? STEP_DURATIONS[step];
    stopTimer();
    remainingRef.current = stepDuration;
    startTimeRef.current = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setProgress(Math.min((elapsed / stepDuration) * 100, 100));
    }, 30);

    intervalRef.current = setTimeout(() => {
      const next = (step + 1) % steps.length;
      setCurrent(next);
      startTimer(next);
    }, stepDuration);
  };

  const handlePause = () => {
    if (pausedRef.current) {
      pausedRef.current = false;
      setPaused(false);
      startTimer(current, remainingRef.current);
    } else {
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
      pausedRef.current = true;
      setPaused(true);
      stopTimer();
    }
  };

  const handleStepClick = (index: number) => {
    pausedRef.current = false;
    setPaused(false);
    setCurrent(index);
    startTimer(index);
  };

  useEffect(() => {
    startTimer(0);
    return () => stopTimer();
  }, []);

  return {
    current,
    progress,
    paused,
    handlePause,
    handleStepClick,
    step: steps[current]
  };
}
