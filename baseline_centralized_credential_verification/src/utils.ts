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
): Promise<boolean> {
  try {
    const payload = {
      recipientName: recipientName,
      credentialType: credentialType,
      issuer: issuer,
    };
    const response = await fetch('http://localhost:5000/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to verify credential: ${response.status} - ${text}`,
      );
    }

    const responseJson = await response.json();
    return responseJson.success === true;
  } catch (error) {
    console.error('Error verifying credential:', error);
    return false;
  }
}

export async function issueCredential(
  credential: IssueCredentialRequest,
): Promise<boolean> {
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

    const responseJson = await response.json();
    return responseJson.success === true;
  } catch (error) {
    console.error('Error issuing credential:', error);
    return false;
  }
}

export async function verifyLogin(
  username: string,
  password: string,
): Promise<boolean> {
  try {
    // create a hash of the passwrod for security purposes
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // generate payload to pass into request
    const payload = {
      username,
      password: hashedPassword,
    };

    const response = await fetch('http://localhost:5000/verify_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return false;

    const responseJson = await response.json();
    return responseJson.success === true;
  } catch (err) {
    console.error('verifyLogin error:', err);
    return false;
  }
}

export async function registerNewUser(username: string, password: string) {
  try {
    // create a hash of the passwrod for security purposes
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // generate payload to pass into request
    const payload = {
      username,
      password: hashedPassword,
    };

    const response = await fetch('http://localhost:5000/register_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return false;

    const responseJson = await response.json();
    return responseJson.success === true;
  } catch (err) {
    console.error('verifyLogin error:', err);
    return false;
  }
}
