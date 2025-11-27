import {
  Autocomplete,
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { CredentialType, credentialTypes } from './types';
import { verifyCredential } from './utils';

export const names = [
  'Nicholas Gingrich',
  'Sean Murphy',
  'Armaan Munisff',
  'Navid Tabrizi',
  'Ryan Murphy',
  'Georgia Tech',
  'UMass Amherst',
];

export default function QueryChain() {
  const [selectedName, setSelectedName] = useState('');
  const [credentialType, setSelectedCredentialType] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [issuer, setIssuer] = useState('');

  const handleCredentialVerification = async (
    name: string,
    type: CredentialType,
  ) => {
    const queryResult = await verifyCredential(name, type, issuer);

    if (queryResult) {
      if (queryResult.valid) {
        setValidationMessage(
          `Valid ${credentialType} issued to ${selectedName} by ${issuer}`,
        );
      } else {
        setValidationMessage('Credential Not Found');
      }
    } else {
      setValidationMessage('Error retrieving credential data');
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
          <Typography variant="h6">Query Issued Credentials</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="contained"
            sx={{ width: '100px', height: '45px' }}
            onClick={() =>
              handleCredentialVerification(
                selectedName,
                credentialType as CredentialType,
              )
            }
          >
            Search
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          flexDirection: 'column',
          marginTop: '10px',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: '10px', mt: '10px' }}>
          <Autocomplete
            options={names}
            value={selectedName}
            onChange={(event, newValue) => setSelectedName(newValue)}
            renderInput={(params) => <TextField {...params} label="Name" />}
            sx={{ width: '100%' }}
          />
          <TextField
            label="Certification Type"
            value={credentialType}
            select
            sx={{ width: '100%' }}
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
            sx={{ width: '100%' }}
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
      <Box sx={{ paddingTop: '20px', paddingBottom: '10px' }}>
        <Divider sx={{ backgroundColor: '#fff' }} />
      </Box>
      <Box>
        <Typography variant="h6" fontSize={16}>
          <strong>Result: </strong>
          {validationMessage}
        </Typography>
      </Box>
    </Box>
  );
}
