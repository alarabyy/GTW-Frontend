export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name?: string; // optional if your API accepts name
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  expiresIn?: number;
  user?: {
    id?: string | number;
    name?: string;
    email?: string;
    // أي خصائص إضافية من الـ API
  };
}
