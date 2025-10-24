// src/app/private/features/caronas/services/carona.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carona, CreateCaronaDTO, UpdateCaronaDTO } from '../models/carona.model';
import { CaronaFilter } from '../models/carona-filter.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaronaService {
  private readonly apiUrl = `${environment.apiUrl || 'http://localhost:8080/api'}/caronas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtém o token armazenado no localStorage
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // ✅ Mesmo nome usado no AuthService
    
    if (!token) {
      console.warn('⚠️ Token não encontrado! Usuário pode não estar autenticado.');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Listar caronas com filtros
   */
  listar(filtros?: CaronaFilter): Observable<Carona[]> {
    let params = new HttpParams();

    if (filtros) {
      if (filtros.origem) params = params.set('origem', filtros.origem);
      if (filtros.destino) params = params.set('destino', filtros.destino);
      if (filtros.data) params = params.set('data', filtros.data);
      if (filtros.status) params = params.set('status', filtros.status);
      if (filtros.apenasMinhasCaronas !== undefined) {
        params = params.set('apenasMinhasCaronas', filtros.apenasMinhasCaronas.toString());
      }
      if (filtros.page) params = params.set('page', filtros.page.toString());
      if (filtros.pageSize) params = params.set('pageSize', filtros.pageSize.toString());
    }

    return this.http.get<Carona[]>(this.apiUrl, { 
      params, 
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Buscar carona por ID
   */
  buscarPorId(id: number): Observable<Carona> {
    return this.http.get<Carona>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Criar nova carona
   */
  criar(carona: CreateCaronaDTO): Observable<Carona> {
    return this.http.post<Carona>(this.apiUrl, carona, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Atualizar carona
   */
  atualizar(id: number, carona: UpdateCaronaDTO): Observable<Carona> {
    return this.http.put<Carona>(`${this.apiUrl}/${id}`, carona, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Deletar carona
   */
  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Cancelar carona
   */
  cancelar(id: number, motivo?: string): Observable<Carona> {
    return this.http.patch<Carona>(`${this.apiUrl}/${id}/cancelar`, 
      { motivo }, 
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Minhas caronas como motorista
   */
  minhasCaronasMotorista(): Observable<Carona[]> {
    return this.http.get<Carona[]>(`${this.apiUrl}/minhas-caronas/motorista`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Minhas caronas como passageiro
   */
  minhasCaronasPassageiro(): Observable<Carona[]> {
    return this.http.get<Carona[]>(`${this.apiUrl}/minhas-caronas/passageiro`, {
      headers: this.getAuthHeaders()
    });
  }
}