
import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
  isSaved?: boolean;
}

export const useCalculatorHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedResults, setSavedResults] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    const savedResultsData = localStorage.getItem('savedCalculatorResults');
    
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setHistory(parsedHistory);
    }
    
    if (savedResultsData) {
      const parsedSaved = JSON.parse(savedResultsData).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setSavedResults(parsedSaved);
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('savedCalculatorResults', JSON.stringify(savedResults));
  }, [savedResults]);

  const addToHistory = (expression: string, result: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: new Date()
    };

    setHistory(prev => [newItem, ...prev.slice(0, 49)]); // Keep last 50 items
  };

  const saveResult = (item: HistoryItem) => {
    const savedItem = { ...item, isSaved: true };
    setSavedResults(prev => [savedItem, ...prev]);
  };

  const removeFromSaved = (id: string) => {
    setSavedResults(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const clearSaved = () => {
    setSavedResults([]);
  };

  return {
    history,
    savedResults,
    addToHistory,
    saveResult,
    removeFromSaved,
    clearHistory,
    clearSaved
  };
};
