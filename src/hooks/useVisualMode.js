import React, { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace = false) {
    setMode(newMode);
    if (replace === false) {
      setHistory(prev => [...prev, newMode]);
    } else {
      const newHistory = history.slice(0, -1);
      setHistory([...newHistory, newMode])
    }
  };

  const back = function() {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    setMode(...newHistory.slice(-1));
    setHistory(newHistory);
  };

  return {
    mode,
    transition,
    back,
    history
  }
}
