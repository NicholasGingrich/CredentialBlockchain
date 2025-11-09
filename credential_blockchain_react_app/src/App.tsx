import { Box, Typography } from '../node_modules/@mui/material';
import { BlockchainProvider } from './BlockchainContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import BlockcahinOverview from './BlockchainView';
import IssueCredential from './IssueCredential';
import QueryChain from './QueryChain';

const queryClient = new QueryClient();

export function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BlockchainProvider>
          <Box sx={{ margin: '50px' }}>
            {/* Title */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 5 }}>
              <Typography variant="h2">
                Blockchain Based Credential Verification
              </Typography>
            </Box>

            {/* Issue and Verify Widgets */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Box sx={{ display: 'flex', gap: 5, width: '100%' }}>
                <QueryChain />
                <IssueCredential />
              </Box>

              {/* View Blockchain Blocks */}
              <BlockcahinOverview />
            </Box>
          </Box>
        </BlockchainProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
