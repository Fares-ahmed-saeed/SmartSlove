
import { useState, useEffect, createContext, useContext } from 'react';

interface SettingsContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  saveOperations: boolean;
  setSaveOperations: (enabled: boolean) => void;
  showHistory: boolean;
  setShowHistory: (enabled: boolean) => void;
  scientificDefault: boolean;
  setScientificDefault: (enabled: boolean) => void;
  playSound: () => void;
  triggerVibration: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const useSettingsProvider = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem('soundEnabled');
    return stored ? JSON.parse(stored) : true;
  });

  const [vibrationEnabled, setVibrationEnabled] = useState(() => {
    const stored = localStorage.getItem('vibrationEnabled');
    return stored ? JSON.parse(stored) : true;
  });

  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    const stored = localStorage.getItem('language') as 'ar' | 'en';
    return stored || 'ar';
  });

  const [saveOperations, setSaveOperations] = useState(() => {
    const stored = localStorage.getItem('saveOperations');
    return stored ? JSON.parse(stored) : true;
  });

  const [showHistory, setShowHistory] = useState(() => {
    const stored = localStorage.getItem('showHistory');
    return stored ? JSON.parse(stored) : true;
  });

  const [scientificDefault, setScientificDefault] = useState(() => {
    const stored = localStorage.getItem('scientificDefault');
    return stored ? JSON.parse(stored) : false;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('vibrationEnabled', JSON.stringify(vibrationEnabled));
  }, [vibrationEnabled]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('saveOperations', JSON.stringify(saveOperations));
  }, [saveOperations]);

  useEffect(() => {
    localStorage.setItem('showHistory', JSON.stringify(showHistory));
  }, [showHistory]);

  useEffect(() => {
    localStorage.setItem('scientificDefault', JSON.stringify(scientificDefault));
  }, [scientificDefault]);

  const playSound = () => {
    if (soundEnabled) {
      const audio = new Audio();
      audio.volume = 0.3;
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  const triggerVibration = () => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return {
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    language,
    setLanguage,
    saveOperations,
    setSaveOperations,
    showHistory,
    setShowHistory,
    scientificDefault,
    setScientificDefault,
    playSound,
    triggerVibration,
  };
};

export { SettingsContext };
