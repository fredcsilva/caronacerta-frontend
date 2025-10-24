// src/app/services/auth.types.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  password: string;
  telefone?: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
  message?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  nome: string;
  emailVerified: boolean;
  posicaoCadastro?: number;
  telefone?: string;
  roles?: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AlterarSenhaRequest {
  email: string;
  codigo: string;
  novaSenha: string;
}

export interface MessageResponse {
  sucesso: boolean;
  mensagem: string;
}