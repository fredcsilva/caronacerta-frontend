import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  active: boolean;
  pendenciaCadastro?: boolean;
  posicaoCadastroComplementar?: number;

  // ✅ NOVO - Avatar
  avatarUrl?: string;
  avatarThumbnailUrl?: string;

  // Dados Pessoais
  dataNascimento?: string;
  telefone?: string;
  genero?: string;

  // Dados do Condomínio
  pais?: string;
  estado?: string;
  nomeCondominio?: string;
  bloco?: string;
  apartamento?: string;

  // Termos
  aceitouTermos?: boolean;
  aceitouPrivacidade?: boolean;
  dataAceiteTermos?: any;
  dataAceitePrivacidade?: any;

  createdAt?: any;
  updatedAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiBaseUrl = environment.apiBaseUrl || 'http://localhost:8081/api';

  // ✅ BehaviorSubject para manter o estado do usuário logado
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * 🔹 Carrega usuário do localStorage/sessionStorage
   */
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('❌ Erro ao carregar usuário do storage:', error);
      }
    }
  }

  /**
   * 🔹 Busca dados completos do usuário no backend
   * Usa o endpoint /users/me ao invés de /users/{userId}
   */
  async fetchUserData(userId: string, token: string): Promise<User> {
    try {
      // ✅ Usa /users/me que já existe no backend
      const user = await this.http.get<User>(
        `${this.apiBaseUrl}/users/me`,
        {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          })
        }
      ).toPromise() as User;

      this.setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error);
      throw error;
    }
  }

  /**
   * 🔹 Define o usuário atual e salva no storage
   */
  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);

    if (user) {
      const userStr = JSON.stringify(user);
      if (localStorage.getItem('userId')) {
        localStorage.setItem('currentUser', userStr);
      }
      if (sessionStorage.getItem('userId')) {
        sessionStorage.setItem('currentUser', userStr);
      }
    } else {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
    }
  }

  /**
   * 🔹 Retorna o usuário atual (síncrono)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * 🔹 Carrega o usuário autenticado (após login)
   */
  loadUserData(): void {
    const token = this.getToken();
    if (!token) {
      console.warn('⚠️ Nenhum token encontrado, usuário não autenticado.');
      return;
    }

    this.http.get<User>(`${this.apiBaseUrl}/users/me`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    }).subscribe({
      next: (user) => {
        this.setCurrentUser(user);
        console.log('✅ Usuário carregado:', user);
      },
      error: (err) => {
        console.error('❌ Erro ao carregar usuário:', err);
        if (err.status === 401 || err.status === 403) {
          this.clearUser();
          window.location.href = '/login';
        }
      }
    });
  }

  /**
   * ✅ Atualiza dados genéricos do usuário e sincroniza localmente
   */
  updateUserData(data: Partial<User>): void {
    const token = this.getToken();
    if (!token) {
      console.error('❌ Token não encontrado');
      return;
    }

    this.http.put<User>(`${this.apiBaseUrl}/users/me`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    }).subscribe({
      next: (updatedUser) => {
        this.currentUserSubject.next(updatedUser);
        this.setCurrentUser(updatedUser); // Salva no storage também
        console.log('✅ Usuário atualizado:', updatedUser);
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar usuário:', err);
        if (err.status === 401) {
          this.clearUser();
          window.location.href = '/login';
        }
      }
    });
  }

  /**
   * 🔹 Limpa dados do usuário (logout)
   */
  clearUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
  }

  /**
   * 🔹 Retorna userId armazenado
   */
  getUserId(): string {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
  }

  /**
   * 🔹 Retorna token armazenado (PADRONIZADO para 'token')
   */
  getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }
}
