export type CredentialType =
  | 'Undergraduate Degree'
  | 'Masters Degree'
  | 'Barbers License'
  | 'Paramedic License';

export const credentialTypes: CredentialType[] = [
  'Undergraduate Degree',
  'Masters Degree',
  'Barbers License',
  'Paramedic License',
];

export type VerifiedCredential = {
  block_index: number;
  credential: {
    recipient: string;
    credential_type: string;
    issuer: string;
    [key: string]: any;
  };
  valid: boolean;
};

export type IssueCredentialRequest = {
  issuer: string;
  recipient: string;
  credential_type: string;
  date_issued?: string;
};

export type IssueCredentialResponse = {
  message: string;
  block_index: number;
};

export type Block = {
  index: number;
  timestamp: string;
  credential_data: any;
  previous_hash: string;
  hash: string;
};

export type CurrentChainResponse = {
  blocks: Block[];
};
