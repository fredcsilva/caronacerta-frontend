import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { POSICAO_MAXIMA } from '../../services/cadastro-complementar-service';

@Component({
  selector: 'app-cadastro-complementar-sucesso',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    Card
  ],
  templateUrl: './cadastro-complementar-sucesso.html',
  styleUrls: ['./cadastro-complementar-sucesso.css']
})
export class CadastroComplementarSucessoComponent implements OnInit {
  
  loading = false;
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Não redireciona automaticamente mais
    // Usuário precisa clicar no botão "Finalizar"
  }

  async finalizarCadastro(): Promise<void> {
    this.loading = true;
    
    try {
      const userId = this.getUserId();
      const token = this.getToken();

      // ✅ Atualizar posição para POSICAO_MAXIMA (cadastro completo)
      await this.http.patch(`${this.apiUrl}/users/${userId}/posicao-cadastro`,
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
      this.router.navigate(['/listar-caronas']);
      
    } catch (error) {
      console.error('❌ Erro ao finalizar cadastro:', error);
      // Mesmo com erro, redireciona (pode ajustar conforme necessário)
      this.router.navigate(['/listar-caronas']);
    } finally {
      this.loading = false;
    }
  }

  irParaPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
  }

  private getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }
}