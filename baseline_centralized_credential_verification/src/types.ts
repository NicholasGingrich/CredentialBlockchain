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
