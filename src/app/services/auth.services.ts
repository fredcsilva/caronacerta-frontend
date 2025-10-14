import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

import { AlterarSenhaRequest, ForgotPasswordRequest, MessageResponse } from './auth.types';

// ========== INTERFACES ==========

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  uid: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  pendenciaCadastro: boolean;
  posicaoCadastroComplementar?: number; // ✅ NOVO CAMPO
  message: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterResponse {
  token: string | null;
  uid: string;
  email: string;
  name: string;
  role: string;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

// ========== SERVIÇO ==========
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/auth';

  constructor(
    private http: HttpClient, 
    private userService: UserService
  ) {}

  /**
   * Realiza o login do usuário, salva o token JWT
   * e carrega os dados completos do usuário autenticado.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        // ✅ Salva token
        localStorage.setItem('token', response.token);

        // ❌ REMOVIDO: Não carrega dados do backend aqui
        // O login.ts já faz isso manualmente com os dados da resposta
        // this.userService.loadUserData();
      })
    );
  }

  /**
   * Registra um novo usuário
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Solicita código de recuperação de senha
   */
  forgotPassword(email: string): Observable<MessageResponse> {
    const data: ForgotPasswordRequest = { email };
    
    return this.http.post<MessageResponse>(`${this.apiUrl}/forgot-password`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Altera senha com código de verificação
   */
  alterarSenha(email: string, codigo: string, novaSenha: string): Observable<MessageResponse> {
    const body: AlterarSenhaRequest = { email, codigo, novaSenha };

    return this.http.post<MessageResponse>(`${this.apiUrl}/alterar-senha`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  /**
   * Redefine senha com código
   */
  resetPassword(email: string, code: string, newPassword: string): Observable<MessageResponse> {
    const data: ResetPasswordRequest = { email, code, newPassword };
    
    return this.http.post<MessageResponse>(`${this.apiUrl}/reset-password`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Verifica se o token é válido
   */
  verifyToken(token: string): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${this.apiUrl}/verify`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Realiza logout
   */
  logout(token: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    });
  }

  /**
   * Obtém o token do storage (localStorage ou sessionStorage)
   */
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Remove o token e dados do usuário
   */
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');
  }
}