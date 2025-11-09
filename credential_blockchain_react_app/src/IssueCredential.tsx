import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  MenuItem,
  Button,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import { useBlockchain } from './BlockchainContext';
import { names } from './QueryChain';
import {
  credentialTypes,
  IssueCredentialRequest,
  IssueCredentialResponse,
} from './types';
import { issueCredential } from './utils';

export default function IssueCredential() {
  const [recipient, setRecipient] = useState('');
  const [credentialType, setSelectedCredentialType] = useState('');
  const [issuer, setIssuer] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  const { refetch } = useBlockchain();

  const handleCredentialIssue = async () => {
    const credential: IssueCredentialRequest = {
      issuer: issuer,
      credential_type: credentialType,
      recipient: recipient,
    };
    const issueResult: IssueCredentialResponse =
      await issueCredential(credential);

    setResultMessage(issueResult.message);

    if (issueResult.block_index) {
      console.log('Refetching');
      refetch();
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        border: '1px solid #fff',
        borderRadius: 2,
        p: 2,
        bgcolor: '#333',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">Issue New Credential</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{ width: '100px', height: '45px' }}
            onClick={handleCredentialIssue}
          >
            Submit
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'row',
            marginTop: '10px',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              mt: '10px',
            }}
          >
            <Autocomplete
              options={names}
              value={recipient}
              onChange={(event, newValue) => setRecipient(newValue)}
              renderInput={(params) => <TextField {...params} label="Name" />}
              sx={{ width: '200px' }}
            />
            <TextField
              label="Certification Type"
              value={credentialType}
              select
              sx={{ width: '200px' }}
              onChange={(evt) => setSelectedCredentialType(evt.target.value)}
            >
              {credentialTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Issuer"
              value={issuer}
              select
              sx={{ width: '200px' }}
              onChange={(evt) => setIssuer(evt.target.value)}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <Box>
          <Box sx={{ paddingTop: '20px', paddingBottom: '10px' }}>
            <Divider sx={{ backgroundColor: '#fff' }} />
          </Box>
          <Typography variant="h6">{`Result: ${resultMessage}`}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
