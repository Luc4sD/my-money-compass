import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PrivacyContextType {
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  enablePrivacyMode: () => void;
  disablePrivacyMode: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

interface PrivacyProviderProps {
  children: ReactNode;
}

export function PrivacyProvider({ children }: PrivacyProviderProps) {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  const togglePrivacyMode = useCallback(() => {
    setIsPrivacyMode(prev => !prev);
  }, []);

  const enablePrivacyMode = useCallback(() => {
    setIsPrivacyMode(true);
  }, []);

  const disablePrivacyMode = useCallback(() => {
    setIsPrivacyMode(false);
  }, []);

  return (
    <PrivacyContext.Provider 
      value={{ 
        isPrivacyMode, 
        togglePrivacyMode, 
        enablePrivacyMode, 
        disablePrivacyMode 
      }}
    >
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
}
