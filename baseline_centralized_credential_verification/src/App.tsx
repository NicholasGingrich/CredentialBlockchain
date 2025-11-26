import { BaselineCentralizedProvider } from './BaselineCentralizedContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppContent from './AppContent';

const queryClient = new QueryClient();

export function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BaselineCentralizedProvider>
          <AppContent />
        </BaselineCentralizedProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
