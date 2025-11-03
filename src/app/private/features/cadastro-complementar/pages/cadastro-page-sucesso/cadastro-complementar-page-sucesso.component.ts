import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { POSICAO_MAXIMA, POSICAO_MINIMA } from '../../../../../private/features/cadastro-complementar/services/cadastro-complementar.service';
import { environment } from '../../../../../../environments/environment';
import { MenuBarComponent } from '../../../../../shared/components/menu-bar/menu-bar.component';

@Component({
  selector: 'app-cadastro-complementar-sucesso',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    Card,
    MenuBarComponent
  ],
  templateUrl: './cadastro-complementar-page-sucesso.component.html',
  styleUrls: ['./cadastro-complementar-page-sucesso.component.css']
})
export class CadastroComplementarPageSucessoComponent implements OnInit {
  
  loading = false;
  private readonly apiBaseUrl = environment.apiBaseUrl || 'http://localhost:8081/api';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('🎉 Tela de Sucesso do Cadastro Complementar carregada');
  }

  async finalizarCadastro(): Promise<void> {
    this.loading = true;
    
    try {
      const userId = this.getUserId();
      const token = this.getToken();

      // ✅ Atualizar posição para POSICAO_MAXIMA (cadastro completo)
      await this.http.patch(`${this.apiBaseUrl}/users/${userId}/posicao-cadastro`,
        { posicaoCadastroComplementar: POSICAO_MAXIMA },
        {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          })
        }
      ).toPromise();

      console.log(`✅ Cadastro finalizado com sucesso! Posição: ${POSICAO_MAXIMA}`);

      // Redirecionar para lista de caronas
      this.router.navigate(['/app/caronas/listar']);
      
    } catch (error) {
      console.error('❌ Erro ao finalizar cadastro:', error);
      // Mesmo com erro, redireciona (pode ajustar conforme necessário)
      this.router.navigate(['/app/caronas/listar']);
    } finally {
      this.loading = false;
    }
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
  }

  private getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }
}