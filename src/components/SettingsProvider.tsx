
import React from 'react';
import { SettingsContext, useSettingsProvider } from '@/hooks/useSettings';

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const settings = useSettingsProvider();

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
