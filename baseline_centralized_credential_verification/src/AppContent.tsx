import { Box, Typography } from '@mui/material';
import { useBaselineCentralizedContext } from './BaselineCentralizedContext';
import IssueCredential from './IssueCredential';
import LoginScreen from './LoginScreen';
import QueryDB from './QueryDB';

export default function AppContent() {
  const { showLoginScreen } = useBaselineCentralizedContext();

  if (showLoginScreen) {
    return <LoginScreen />;
  }

  return (
    <>
      <Box sx={{ margin: '50px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 5 }}>
          <Typography variant="h2">Centralized Credential Storage</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Box sx={{ display: 'flex', gap: 5, width: '100%' }}>
            <QueryDB />
            <IssueCredential />
          </Box>

          {/* View Blockchain Blocks */}
          {/* <BlockcahinOverview /> */}
        </Box>
      </Box>
    </>
  );
}
