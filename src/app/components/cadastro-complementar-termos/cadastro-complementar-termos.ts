import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { ScrollPanel } from 'primeng/scrollpanel';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HapticService } from '../../services/haptic.service';
import { RippleModule } from 'primeng/ripple'; 
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cadastro-complementar-termos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Card,
    Checkbox,
    ScrollPanel,
    Toast,
    RippleModule 
  ],
  providers: [MessageService],
  templateUrl: './cadastro-complementar-termos.html',
  styleUrls: ['./cadastro-complementar-termos.css']
})
export class CadastroComplementarTermosComponent implements OnInit {
  
  termosForm!: FormGroup;
  loading = false;
  carregandoDados = true; // ✅ NOVO: loading para carregamento inicial
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8080/api';
  private haptic = inject(HapticService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.carregarDadosUsuario();
  }

  /**
   * ✅ NOVO: Carrega dados do usuário do backend
   */
  private async carregarDadosUsuario(): Promise<void> {
    this.carregandoDados = true;

    try {
      const userId = this.getUserId();
      const token = this.getToken();

      if (!userId || !token) {
        console.error('❌ UserId ou Token não encontrado');
        this.carregandoDados = false;
        return;
      }

      // Busca dados do usuário
      const user = await this.userService.fetchUserData(userId, token);
      console.log('📦 Dados do usuário carregados:', user);

      // Preenche o formulário
      if (user) {
        this.termosForm.patchValue({
          aceitaTermos: user.aceitouTermos || false,
          aceitaPrivacidade: user.aceitouPrivacidade || false
        });

        // ✅ Força atualização do estado de validação
        this.termosForm.markAllAsTouched();
        this.termosForm.updateValueAndValidity();

        console.log('✅ Formulário preenchido:', this.termosForm.value);
        console.log('✅ Formulário válido:', this.termosForm.valid);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar seus dados. Tente novamente.',
        life: 5000
      });
    } finally {
      this.carregandoDados = false;
    }
  }

  initForm(): void {
    this.termosForm = this.fb.group({
      aceitaTermos: [false, Validators.requiredTrue],
      aceitaPrivacidade: [false, Validators.requiredTrue]
    });
  }

  async aceitarTermos(): Promise<void> {
    if (this.termosForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Você precisa aceitar ambos os termos para continuar.',
        life: 4000
      });
      return;
    }

    this.loading = true;

    try {
      const userId = this.getUserId();
      const token = this.getToken();
      const posicaoAtual = 4; // Esta tela é posição 4
      const novaPosicao = posicaoAtual + 1;

      console.log('🔄 Aceitando termos...');

      // ✅ ÚNICO PONTO DE ATUALIZAÇÃO: Envia tudo junto pro backend
      await this.http.patch(
        `${this.apiUrl}/users/${userId}/posicao-cadastro`,
        { 
          posicaoCadastroComplementar: novaPosicao,
          aceitouTermos: true,
          aceitouPrivacidade: true
        },
        {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          })
        }
      ).toPromise();

      console.log(`✅ Backend atualizado - Posição: ${novaPosicao}`);

      // ✅ Atualiza o cache local com a nova posição e dados
      const usuarioAtual = this.userService.getCurrentUser();
      if (usuarioAtual) {
        usuarioAtual.posicaoCadastroComplementar = novaPosicao;
        usuarioAtual.aceitouTermos = true;
        usuarioAtual.aceitouPrivacidade = true;
        
        this.userService.setCurrentUser(usuarioAtual);
        console.log(`🔒 Cache local atualizado - Posição: ${novaPosicao}`);
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Termos aceitos com sucesso!',
        life: 2000
      });

      setTimeout(() => {
        console.log('➡️ Redirecionando para /cadastro-complementar-sucesso');
        this.router.navigate(['/cadastro-complementar-sucesso']);
      }, 1500);

    } catch (error) {
      console.error('❌ Erro ao aceitar termos:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível processar. Tente novamente.',
        life: 5000
      });
    } finally {
      this.loading = false;
    }
  }

  logout(): void {
    this.haptic.lightTap();
    
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');

    console.log('✅ Logout realizado');
    
    this.messageService.add({
      severity: 'info',
      summary: 'Logout',
      detail: 'Você saiu do sistema.',
      life: 2000
    });

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
  }

  private getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }
}