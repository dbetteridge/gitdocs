export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationDetails {
  name: string;
  email: string;
  password: string;
  invite_token?: string;
}

export interface OAuthTokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  expiry_time?: number;
}

export interface RegistrationResult {
  error?: string;
  token?: string;
}
