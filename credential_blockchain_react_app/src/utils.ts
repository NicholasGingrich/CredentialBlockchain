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

    if (!response.ok) {
      console.error('Request failed:', response.status, response.statusText);
      return null;
    }

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

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to issue credential: ${response.status} - ${text}`,
      );
    }

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

    if (!response.ok) {
      throw new Error(`Failed to get current chain data: ${response.status}`);
    }

    const data: Block[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting block data:', error);
    return [];
  }
}
