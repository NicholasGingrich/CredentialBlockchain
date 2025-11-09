import { createContext, useContext } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCurrentChain } from './utils';
import { Block } from './types';

interface BlockchainContextValue {
  blocks: Block[];
  refetch: () => void;
}

const BlockchainContext = createContext<BlockchainContextValue | null>(null);

export function BlockchainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data = [], refetch } = useSuspenseQuery<Block[]>({
    queryKey: ['blockchain'],
    queryFn: getCurrentChain,
    refetchInterval: 3000,
  });

  return (
    <BlockchainContext.Provider value={{ blocks: data, refetch }}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const ctx = useContext(BlockchainContext);
  if (!ctx)
    throw new Error('useBlockchain must be used within BlockchainProvider');
  return ctx;
}
