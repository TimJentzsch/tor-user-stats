import fetch from 'node-fetch';

interface RequesterConfig {
  userAgent: string;
  clientId: string;
  deviceId: string;
}

interface Token {
  accessToken: string;
  validUntil: Date;
  scope: string;
}

class Requester {
  private token?: Token;

  constructor(public config: RequesterConfig) {}

  public async getUserInfo(username: string): Promise<any> {
    return null;
  }

  /** Get an up-to-date token for the Reddit API. */
  private async getToken(): Promise<Token> {
    const token = this.token;

    // Take the cashed token if it's still valid
    if (token && token.validUntil.valueOf() > Date.now()) {
      return token;
    }

    type TokenResponse = {
      access_token: string;
      token_type: 'bearer';
      expires_in: number;
      scope: string;
    };

    // Otherwise, generate a new one
    const response = (await this.rawRequest('/api/v1/access_token', {
      grant_type: 'https://oauth.reddit.com/grants/installed_client&\\',
      device_id: this.config.deviceId,
    })) as TokenResponse;

    const newToken: Token = {
      accessToken: response.access_token,
      scope: response.scope,
      validUntil: new Date(Date.now() + response.expires_in * 1000),
    };

    this.token = newToken;
    return newToken;
  }

  /** Helper function to create a Reddit API request with the current token. */
  private async request(uri: string, body: unknown): Promise<unknown> {
    return null;
  }

  /** Helper function to create a Reddit API requests. */
  private async rawRequest(uri: string, body: unknown): Promise<unknown> {
    const BASE_URL = 'https://www.reddit.com';

    const response = await fetch(`${BASE_URL}${uri}`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

    return response.json();
  }
}
