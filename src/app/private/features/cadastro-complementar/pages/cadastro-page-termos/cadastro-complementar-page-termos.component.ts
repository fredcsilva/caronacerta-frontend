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
import { RippleModule } from 'primeng/ripple';

// ✅ IMPORTS CORRIGIDOS para a estrutura real
import { environment } from '../../../../../../environments/environment';
import { HapticService } from '../../../../../core/services/haptic.service';
import { UserService } from '../../../../../core/services/user.service';
import { ConfiguracaoAppService } from '../../../../../core/services/configuracao-app.service';

import { MenuBarComponent } from '../../../../../shared/components/menu-bar/menu-bar.component';

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
    RippleModule,
    MenuBarComponent
  ],
  providers: [MessageService],
  templateUrl: './cadastro-complementar-page-termos.component.html',
  styleUrls: ['./cadastro-complementar-page-termos.component.css']
})
export class CadastroComplementarTermosComponent implements OnInit {
  
  termosForm!: FormGroup;
  loading = false;
  carregandoDados = true;
  
  // ✅ NOVO - Textos carregados do Firestore
  textoTermosCondicoes: string = '';
  textoPoliticaPrivacidade: string = '';
  
  private readonly apiBaseUrl = environment.apiBaseUrl || 'http://localhost:8081/api';
  private haptic = inject(HapticService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private http: HttpClient,
    private configuracaoAppService: ConfiguracaoAppService // ✅ NOVO
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.carregarTextosTermosPrivacidade(); // ✅ NOVO - Carrega textos primeiro
    await this.carregarDadosUsuario();
  }

  /**
   * ✅ NOVO - Carrega textos de Termos e Privacidade do Firestore
   */
  private async carregarTextosTermosPrivacidade(): Promise<void> {
    try {
      console.log('📄 Carregando textos de termos e privacidade...');

      const resultado = await this.configuracaoAppService.getTermosEPrivacidade().toPromise();

      if (resultado) {
        this.textoTermosCondicoes = resultado.termosCondicoes || '';
        this.textoPoliticaPrivacidade = resultado.politicaPrivacidade || '';

        console.log('✅ Textos carregados:', {
          termos: this.textoTermosCondicoes.length + ' caracteres',
          privacidade: this.textoPoliticaPrivacidade.length + ' caracteres'
        });
      }

    } catch (error) {
      console.error('❌ Erro ao carregar textos:', error);
      this.showError('Erro', 'Não foi possível carregar os termos e política de privacidade.');
      
      // Textos padrão em caso de erro
      this.textoTermosCondicoes = 'Erro ao carregar os termos de uso. Por favor, tente novamente.';
      this.textoPoliticaPrivacidade = 'Erro ao carregar a política de privacidade. Por favor, tente novamente.';
    }
  }

  /**
   * Carrega dados do usuário do backend
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

        // Força atualização do estado de validação
        this.termosForm.markAllAsTouched();
        this.termosForm.updateValueAndValidity();

        console.log('✅ Formulário preenchido:', this.termosForm.value);
        console.log('✅ Formulário válido:', this.termosForm.valid);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error);
      this.showError('Erro', 'Não foi possível carregar seus dados. Tente novamente.');
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
      this.showWarning('Atenção', 'Você precisa aceitar ambos os termos para continuar.');
      return;
    }

    this.loading = true;

    try {
      const userId = this.getUserId();
      const token = this.getToken();
      const posicaoAtual = 4; // Esta tela é posição 4
      const novaPosicao = posicaoAtual + 1;

      console.log('📄 Aceitando termos...');

      // Envia tudo junto pro backend
      await this.http.patch(
        `${this.apiBaseUrl}/users/${userId}/posicao-cadastro`,
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

      // Atualiza o cache local com a nova posição e dados
      const usuarioAtual = this.userService.getCurrentUser();
      if (usuarioAtual) {
        usuarioAtual.posicaoCadastroComplementar = novaPosicao;
        usuarioAtual.aceitouTermos = true;
        usuarioAtual.aceitouPrivacidade = true;
        
        this.userService.setCurrentUser(usuarioAtual);
        console.log(`🔒 Cache local atualizado - Posição: ${novaPosicao}`);
      }

      this.showSuccess('Sucesso', 'Termos aceitos com sucesso!');

      setTimeout(() => {
        console.log('➡️ Redirecionando para /app/cadastro-complementar/sucesso');
        this.router.navigate(['/app/cadastro-complementar/sucesso']);
      }, 1500);

    } catch (error) {
      console.error('❌ Erro ao aceitar termos:', error);
      this.showError('Erro', 'Não foi possível processar. Tente novamente.');
    } finally {
      this.loading = false;
    }
  }

  /**
   * ✅ Métodos para exibir mensagens toast centralizadas
   */
  private showSuccess(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
      life: 3000,
      key: 'tc'
    });
  }

  private showError(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 5000,
      key: 'tc'
    });
  }

  private showWarning(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: detail,
      life: 4000,
      key: 'tc'
    });
  }

  private showInfo(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: detail,
      life: 3000,
      key: 'tc'
    });
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
  }

  private getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }
}