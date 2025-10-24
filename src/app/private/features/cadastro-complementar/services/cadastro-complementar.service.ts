import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

/**
 * Constantes de posição do cadastro complementar
 */
export const POSICAO_MINIMA = 1;
export const POSICAO_MAXIMA = 6;

/**
 * Mapeamento das posições do cadastro complementar para rotas
 */
export const POSICOES_CADASTRO_COMPLEMENTAR: Record<number, string> = {
  1: '/app/cadastro-complementar/boas-vindas',
  2: '/app/cadastro-complementar/dados-pessoais',
  3: '/app/cadastro-complementar/condominio',  // ✅ Adicionar /app/
  4: '/app/cadastro-complementar/termos',      // ✅ Adicionar /app/
  5: '/app/cadastro-complementar/sucesso',     // ✅ Adicionar /app/
  6: '/app/caronas/listar' // Cadastro completo
};

@Injectable({
  providedIn: 'root'
})
export class CadastroComplementarService {
  
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  /**
   * Redireciona o usuário para a tela correspondente à sua posição no cadastro complementar
   * @param posicao - Posição atual do usuário no fluxo de cadastro (POSICAO_MINIMA a POSICAO_MAXIMA)
   */
  redirecionarParaPosicao(posicao: number | null | undefined): void {
    // Se posição não existe ou é inválida, vai para posição mínima
    if (!posicao || !this.isPosicaoValida(posicao)) {
      console.warn(`Posição inválida: ${posicao}. Redirecionando para posição inicial.`);
      this.router.navigate([POSICOES_CADASTRO_COMPLEMENTAR[POSICAO_MINIMA]]);
      return;
    }

    // Se posição é válida, redireciona
    const rota = POSICOES_CADASTRO_COMPLEMENTAR[posicao];
    console.log(`Redirecionando para posição ${posicao}: ${rota}`);
    this.router.navigate([rota]);
  }

  /**
   * Verifica se a posição é válida (entre POSICAO_MINIMA e POSICAO_MAXIMA)
   */
  isPosicaoValida(posicao: number): boolean {
    return posicao >= POSICAO_MINIMA && posicao <= POSICAO_MAXIMA;
  }

  /**
   * Retorna a próxima posição no fluxo
   */
  getProximaPosicao(posicaoAtual: number): number {
    if (posicaoAtual >= POSICAO_MAXIMA) {
      return POSICAO_MAXIMA;
    }
    return posicaoAtual + 1;
  }

  /**
   * Retorna a posição anterior no fluxo
   */
  getPosicaoAnterior(posicaoAtual: number): number {
    if (posicaoAtual <= POSICAO_MINIMA) {
      return POSICAO_MINIMA;
    }
    return posicaoAtual - 1;
  }

  /**
   * Verifica se o cadastro complementar está completo
   */
  isCadastroCompleto(posicao: number): boolean {
    return posicao >= POSICAO_MAXIMA;
  }

  /**
   * Retorna a rota correspondente a uma posição
   */
  getRotaPorPosicao(posicao: number): string {
    return POSICOES_CADASTRO_COMPLEMENTAR[posicao] || POSICOES_CADASTRO_COMPLEMENTAR[POSICAO_MINIMA];
  }

  /**
   * Método usado pelo Guard (alias para getRotaPorPosicao)
   */
  obterRotaPorPosicao(posicao: number): string {
    return this.getRotaPorPosicao(posicao);
  }

  /**
   * Atualiza a posição do cadastro complementar no backend
   */
  atualizarPosicao(userId: string, posicao: number): Observable<any> {
    const token = this.getToken();
    
    return this.http.patch(`${this.apiUrl}/users/${userId}/posicao-cadastro`, 
      { posicaoCadastroComplementar: posicao },
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    );
  }

  /**
   * Obtém o token do storage
   */
  private getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
}