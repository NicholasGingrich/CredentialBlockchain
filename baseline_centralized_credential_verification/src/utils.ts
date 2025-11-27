import { IssueCredentialRequest } from './types';

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
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuff = await crypto.subtle.digest('SHA-256', data);
    const hashArr = Array.from(new Uint8Array(hashBuff));
    const hashedPassword = hashArr
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const payload = {
      username,
      password: hashedPassword,
    };

    const response = await fetch('http://localhost:5000/verify_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();
    return responseJson.success === true;
  } catch (err) {
    return false;
  }
}

export async function registerNewUser(username: string, password: string) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuff = await crypto.subtle.digest('SHA-256', data);
    const hashArr = Array.from(new Uint8Array(hashBuff));
    const hashedPassword = hashArr
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const payload = {
      username,
      password: hashedPassword,
    };

    const response = await fetch('http://localhost:5000/register_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();
    return responseJson.success === true;
  } catch (err) {
    console.error('verifyLogin error:', err);
    return false;
  }
}
