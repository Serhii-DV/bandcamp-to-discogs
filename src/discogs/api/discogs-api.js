export class DiscogsAPI {
  constructor(consumerKey, consumerSecret, token, tokenSecret) {
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.token = token;
    this.tokenSecret = tokenSecret;
    this.apiUrl = 'https://api.discogs.com/';
  }

  async search(query) {
    const endpoint = 'database/search';
    const fullUrl = `${this.apiUrl}${endpoint}?q=${query}`;
    const requestHeaders = this.buildOAuthHeaders('GET', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: requestHeaders
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  }

  buildOAuthHeaders(method, url) {
    const oauthHeaders = {
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: this.generateNonce(),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_token: this.token,
      oauth_version: '1.0'
    };

    const signatureBaseString = this.buildSignatureBaseString(
      method,
      url,
      oauthHeaders
    );
    const signature = this.calculateSignature(signatureBaseString);

    oauthHeaders.oauth_signature = signature;

    return {
      Authorization: this.buildAuthorizationHeader(oauthHeaders)
    };
  }

  buildSignatureBaseString(method, url, oauthHeaders) {
    const normalizedHeaders = Object.keys(oauthHeaders)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(oauthHeaders[key])}`)
      .join('&');

    return `${method}&${encodeURIComponent(url)}&${encodeURIComponent(normalizedHeaders)}`;
  }

  calculateSignature(signatureBaseString) {
    const signingKey = `${encodeURIComponent(this.consumerSecret)}&${encodeURIComponent(this.tokenSecret)}`;
    const crypto = require('crypto');
    return crypto
      .createHmac('sha1', signingKey)
      .update(signatureBaseString)
      .digest('base64');
  }

  generateNonce() {
    return Math.random().toString(36).substring(2, 12);
  }

  buildAuthorizationHeader(oauthHeaders) {
    return (
      'OAuth ' +
      Object.keys(oauthHeaders)
        .map((key) => `${key}="${encodeURIComponent(oauthHeaders[key])}"`)
        .join(', ')
    );
  }
}
