import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CondominioDTO {
  slug: string;
  nome: string;
  pais: string;
  estado: string;
  cidade: string;
}

export interface BlocoDTO {
  blocoId: string;
  blocoNome: string;
}

@Injectable({
  providedIn: 'root'
})
export class CondominioService {
  
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  async listarCondominios(token: string): Promise<CondominioDTO[]> {
    return firstValueFrom(
      this.http.get<CondominioDTO[]>(`${this.apiUrl}/condominios`, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      })
    );
  }

  async listarBlocos(slug: string, token: string): Promise<BlocoDTO[]> {
    return firstValueFrom(
      this.http.get<BlocoDTO[]>(`${this.apiUrl}/condominios/${slug}/blocos`, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      })
    );
  }

  async listarApartamentos(slug: string, blocoId: string, token: string): Promise<string[]> {
    return firstValueFrom(
      this.http.get<string[]>(`${this.apiUrl}/condominios/${slug}/blocos/${blocoId}/apartamentos`, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      })
    );
  }

  private getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }
}