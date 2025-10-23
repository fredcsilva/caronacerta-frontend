// src/app/services/auth.types.ts
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
