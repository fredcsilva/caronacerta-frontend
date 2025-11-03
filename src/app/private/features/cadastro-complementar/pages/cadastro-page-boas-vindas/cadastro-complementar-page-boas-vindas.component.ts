import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MenuBarComponent } from '../../../../../shared/components/menu-bar/menu-bar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { UserService } from '../../../../../core/services/user.service';

@Component({  
  selector: 'app-cadastro-complementar-boas-vindas',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    Card,
    Toast,
    MenuBarComponent
  ],
  providers: [MessageService],
  templateUrl: './cadastro-complementar-page-boas-vindas.component.html',
  styleUrls: ['./cadastro-complementar-page-boas-vindas.component.css']
})
export class CadastroComplementarPageBoasVindasComponent implements OnInit {
  
  loading = false;
  private readonly apiBaseUrl = environment.apiBaseUrl || 'http://localhost:8081/api';
  private userService = inject(UserService);

  constructor(
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('📋 Tela de Boas-Vindas do Cadastro Complementar carregada');
  }

  async iniciarCadastro(): Promise<void> {
    this.loading = true;

    try {
      const userId = this.getUserId();
      const token = this.getToken();

      console.log('🔍 UserId:', userId);
      console.log('🔍 Token existe:', !!token);

      if (!userId || !token) {
        console.error('❌ Token ou UserId não encontrado');
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Sessão expirada. Faça login novamente.',
          life: 5000
        });
        this.router.navigate(['/login']);
        return;
      }

      const posicaoAtual = 1;
      const novaPosicao = posicaoAtual + 1;

      console.log('🔄 Atualizando posição de 1 para 2...');

      // ✅ Atualiza posição no backend
      await this.http.patch(
        `${this.apiBaseUrl}/users/${userId}/posicao-cadastro`,
        { posicaoCadastroComplementar: novaPosicao },
        {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          })
        }
      ).toPromise();

      console.log(`✅ Posição atualizada para ${novaPosicao} no backend`);

      // ✅ Atualiza cache local
      const usuarioAtual = this.userService.getCurrentUser();
      if (usuarioAtual) {
        usuarioAtual.posicaoCadastroComplementar = novaPosicao;
        this.userService.setCurrentUser(usuarioAtual);
        console.log(`🔒 Cache local atualizado - Posição: ${novaPosicao}`);
      }

      // ✅ Redireciona para próxima tela
      console.log('➡️ Redirecionando para /app/cadastro-complementar/dados-pessoais');
      this.router.navigate(['/app/cadastro-complementar/dados-pessoais']);

    } catch (error: any) {
      console.error('❌ Erro ao iniciar cadastro:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível iniciar o cadastro complementar.',
        life: 5000
      });
    } finally {
      this.loading = false;
    }
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
  }

  private getToken(): string {
    // ✅ CORRIGIDO: usa 'token' em vez de 'authToken'
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }
}