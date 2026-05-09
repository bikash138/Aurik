"use client";

import { useState, useEffect } from "react";

export function useTypewriter(text: string, speed = 40, delay = 0, active = true) {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    
    let i = 0;
    setDisplayed("");
    
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, ++i));
        } else {
          clearInterval(iv);
        }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    
    return () => clearTimeout(t);
  }, [active, text, speed, delay]);
  
  return displayed;
}
