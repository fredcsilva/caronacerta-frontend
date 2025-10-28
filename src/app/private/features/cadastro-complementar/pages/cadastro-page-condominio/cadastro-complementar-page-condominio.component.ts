import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { HapticService } from '../../../../../core/services/haptic.service';
import { UserService } from '../../../../../core/services/user.service';
import { MenuBarComponent } from '../../../../../shared/components/menu-bar/menu-bar.component';

@Component({
  selector: 'app-cadastro-complementar-condominio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Card,
    InputText,
    Select,
    Toast,
    MenuBarComponent
  ],
  providers: [MessageService],
  templateUrl: './cadastro-complementar-page-condominio.component.html',
  styleUrls: ['./cadastro-complementar-page-condominio.component.css']
})
export class CadastroComplementarPageCondominioComponent implements OnInit {
  
  condominioForm!: FormGroup;
  loading = false;
  carregandoDados = true;
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8080/api';
  private haptic = inject(HapticService);
  
  paisOptions = [
    { label: 'Brasil', value: 'BRASIL' }
  ];
  
  estadoOptions = [
    { label: 'Rio Grande do Norte', value: 'RN' }
  ];

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
   * ✅ Carrega dados do usuário do backend
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
        this.condominioForm.patchValue({
          pais: user.pais?.trim() || 'BRASIL',
          estado: user.estado?.trim() || 'RN',
          nomeCondominio: user.nomeCondominio?.trim() || '',
          bloco: user.bloco?.trim() || '',
          apartamento: user.apartamento?.trim() || ''
        });

        // ✅ Força atualização do estado de validação
        this.condominioForm.markAllAsTouched();
        this.condominioForm.updateValueAndValidity();

        console.log('✅ Formulário preenchido:', this.condominioForm.value);
        console.log('✅ Formulário válido:', this.condominioForm.valid);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error);
      this.showError('Erro', 'Não foi possível carregar seus dados. Tente novamente.');
    } finally {
      this.carregandoDados = false;
    }
  }

  initForm(): void {
    this.condominioForm = this.fb.group({
      pais: ['BRASIL', Validators.required],
      estado: ['RN', Validators.required],
      nomeCondominio: ['', [Validators.required, Validators.minLength(3)]],
      bloco: ['', Validators.required],
      apartamento: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  async salvarCondominio(): Promise<void> {
    if (this.condominioForm.invalid) {
      this.markFormGroupTouched(this.condominioForm);
      this.showWarning('Atenção', 'Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.loading = true;

    try {
      const dados = this.condominioForm.value;
      const userId = this.getUserId();
      const token = this.getToken();
      const posicaoAtual = 3; // Esta tela é posição 3
      const novaPosicao = posicaoAtual + 1;

      console.log('🔄 Salvando dados do condomínio...');

      // ✅ ÚNICO PONTO DE ATUALIZAÇÃO: Envia tudo junto pro backend
      await this.http.patch(
        `${this.apiUrl}/users/${userId}/posicao-cadastro`,
        { 
          posicaoCadastroComplementar: novaPosicao,
          pais: dados.pais,
          estado: dados.estado,
          nomeCondominio: dados.nomeCondominio,
          bloco: dados.bloco,
          apartamento: dados.apartamento
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
        usuarioAtual.pais = dados.pais;
        usuarioAtual.estado = dados.estado;
        usuarioAtual.nomeCondominio = dados.nomeCondominio;
        usuarioAtual.bloco = dados.bloco;
        usuarioAtual.apartamento = dados.apartamento;
        
        this.userService.setCurrentUser(usuarioAtual);
        console.log(`🔒 Cache local atualizado - Posição: ${novaPosicao}`);
      }

      this.showSuccess('Sucesso', 'Dados do condomínio salvos com sucesso!');

      setTimeout(() => {
        console.log('➡️ Redirecionando para /app/cadastro-complementar/termos');
        this.router.navigate(['/app/cadastro-complementar/termos']);
      }, 1500);

    } catch (error: any) {
      console.error('❌ Erro ao salvar dados do condomínio:', error);

      this.showError('Erro', 'Não foi possível salvar os dados. Tente novamente.');
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
  // ❌ REMOVIDO: método logout() - deve estar no menu-bar component

  private getUserId(): string {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
  }

  private getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}