import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TermosPrivacidadeResponse {
  termosCondicoes: string;
  politicaPrivacidade: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoAppService {
  
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /**
   * Busca Termos de Uso e Política de Privacidade
   */
  getTermosEPrivacidade(): Observable<TermosPrivacidadeResponse> {
    // ✅ Obter token do storage
    const token = this.getToken();
    
    // ✅ Criar headers com Authorization
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<TermosPrivacidadeResponse>(
      `${this.apiUrl}/configuracoes/termos-privacidade`,
      { headers } // ✅ Enviar headers
    );
  }

  /**
   * Obtém token do storage
   */
  private getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }
}