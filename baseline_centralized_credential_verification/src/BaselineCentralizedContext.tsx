import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

interface BaselineCentralizedContextValue {
  showLoginScreen: boolean;
  setShowLoginScreen: Dispatch<SetStateAction<boolean>>;
}

const BaselineCentralizedContext =
  createContext<BaselineCentralizedContextValue | null>(null);

export function BaselineCentralizedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(true);

  return (
    <BaselineCentralizedContext.Provider
      value={{ showLoginScreen, setShowLoginScreen }}
    >
      {children}
    </BaselineCentralizedContext.Provider>
  );
}

export function useBaselineCentralizedContext() {
  const ctx = useContext(BaselineCentralizedContext);
  if (!ctx)
    throw new Error('useBlockchain must be used within BlockchainProvider');
  return ctx;
}
