import {
  VerifiedCredential,
  CredentialType,
  IssueCredentialRequest,
  IssueCredentialResponse,
  CurrentChainResponse,
  Block,
} from './types';

export async function verifyCredential(
  recipientName: string,
  credentialType: string,
  issuer: string,
): Promise<VerifiedCredential | null> {
  try {
    const response = await fetch(
      `http://localhost:5000/verify/${encodeURIComponent(recipientName)}?type=${encodeURIComponent(credentialType)}&issuer=${encodeURIComponent(issuer)}`,
    );

    const data = (await response.json()) as VerifiedCredential;
    return data;
  } catch (error) {
    console.error('Error verifying credential:', error);
    return null;
  }
}

export async function issueCredential(
  credential: IssueCredentialRequest,
): Promise<IssueCredentialResponse> {
  try {
    const response = await fetch('http://localhost:5000/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credential),
    });

    const data: IssueCredentialResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error issuing credential:', error);
    return { message: 'Error issuing credential', block_index: null };
  }
}

export async function getCurrentChain(): Promise<Block[]> {
  try {
    const response = await fetch('http://localhost:5000/chain');

    const data: Block[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting block data:', error);
    return [];
  }
}
