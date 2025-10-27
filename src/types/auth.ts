export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

