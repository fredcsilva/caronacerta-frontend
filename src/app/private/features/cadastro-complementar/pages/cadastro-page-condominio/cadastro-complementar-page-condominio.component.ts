import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { HapticService } from '../../../../../core/services/haptic.service';
import { UserService } from '../../../../../core/services/user.service';
import { CondominioService, CondominioDTO, BlocoDTO } from '../../../../../core/services/condominio.service';
import { MenuBarComponent } from '../../../../../shared/components/menu-bar/menu-bar.component';

@Component({
  selector: 'app-cadastro-complementar-condominio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Card,
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
  
  private readonly apiBaseUrl = environment.apiBaseUrl || 'http://localhost:8081/api';
  private haptic = inject(HapticService);
  
  // Opções dos dropdowns
  condominioOptions: { label: string; value: string }[] = [];
  blocoOptions: { label: string; value: string }[] = [];
  apartamentoOptions: { label: string; value: string }[] = [];
  
  // Dados carregados
  condominios: CondominioDTO[] = [];
  condominioSelecionado: CondominioDTO | null = null;
  slugAtual: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private condominioService: CondominioService,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.carregarCondominios();
    await this.preencherCondominioSeJaExiste();  // ✅ Só preenche o condomínio
  }

  initForm(): void {
    this.condominioForm = this.fb.group({
      condominio: ['', Validators.required],
       bloco: [{ value: '', disabled: true }, Validators.required],  // ✅ Inicia desabilitado
       apartamento: [{ value: '', disabled: true }, Validators.required]  // ✅ Inicia desabilitado
    });
    
    // Listener para mudanças no condomínio
    this.condominioForm.get('condominio')?.valueChanges.subscribe(async (slug) => {
      if (slug) {
        await this.onCondominioChange(slug);
      }
    });
    
    // Listener para mudanças no bloco
    this.condominioForm.get('bloco')?.valueChanges.subscribe(async (blocoId) => {
      if (blocoId && this.slugAtual) {
        await this.onBlocoChange(blocoId);
      }
    });
  }

  /**
   * Preenche apenas o condomínio se o usuário já tiver cadastrado
   */
  private async preencherCondominioSeJaExiste(): Promise<void> {
    try {
      const userId = this.getUserId();
      const token = this.getToken();

      if (!userId || !token) return;

      const user = await this.userService.fetchUserData(userId, token);
      
      if (user && user.nomeCondominio) {
        // Encontra o condomínio pelo nome
        const cond = this.condominios.find(c => 
          c.nome.toLowerCase() === user.nomeCondominio?.toLowerCase()
        );
        
        if (cond) {
          // ✅ Só preenche o condomínio (isso vai disparar o onCondominioChange)
          this.condominioForm.patchValue({ condominio: cond.slug });
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar condomínio do usuário:', error);
    }
  }
  /**
   * Carrega lista de condomínios
   */
  private async carregarCondominios(): Promise<void> {
    try {
      const token = this.getToken();
      this.condominios = await this.condominioService.listarCondominios(token);
      
      this.condominioOptions = this.condominios.map(c => ({
        label: c.nome,
        value: c.slug
      })).sort((a, b) => a.label.localeCompare(b.label)); // ✅ Ordena A-Z
      
      console.log('✅ Condomínios carregados:', this.condominioOptions.length);
    } catch (error) {
      console.error('❌ Erro ao carregar condomínios:', error);
      this.showError('Erro', 'Não foi possível carregar os condomínios.');
    }
  }

  /**
   * Quando seleciona um condomínio
   */
  private async onCondominioChange(slug: string): Promise<void> {
    try {
      this.slugAtual = slug;
      this.condominioSelecionado = this.condominios.find(c => c.slug === slug) || null;
      
      // Limpa e desabilita blocos e apartamentos
      this.blocoOptions = [];
      this.apartamentoOptions = [];
      this.condominioForm.get('bloco')?.disable();
      this.condominioForm.get('apartamento')?.disable();
      this.condominioForm.patchValue({ bloco: '', apartamento: '' }, { emitEvent: false });
      
      // Carrega blocos
      const token = this.getToken();
      const blocos = await this.condominioService.listarBlocos(slug, token);
      
      this.blocoOptions = blocos
        .map(b => ({ label: b.blocoNome, value: b.blocoId }))
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
      
      // Habilita bloco se tem opções
      if (this.blocoOptions.length > 0) {
        this.condominioForm.get('bloco')?.enable();
      }
      
      console.log('✅ Blocos carregados:', this.blocoOptions.length);
      
      // ✅ NOVO: Preenche bloco e apartamento se o usuário já tiver cadastrado
      await this.preencherBlocoEApartamentoSeExistem();
      
    } catch (error) {
      console.error('❌ Erro ao carregar blocos:', error);
      this.showError('Erro', 'Não foi possível carregar os blocos.');
    }
  }

  /**
   * Preenche bloco e apartamento se o usuário já tiver cadastrado
   */
  private async preencherBlocoEApartamentoSeExistem(): Promise<void> {
    try {
      const userId = this.getUserId();
      const token = this.getToken();

      if (!userId || !token) return;

      const user = await this.userService.fetchUserData(userId, token);
      
      if (user && user.bloco) {
        // Aguarda um pouco para garantir que blocos foram carregados
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Preenche bloco (isso vai disparar o onBlocoChange)
        this.condominioForm.patchValue({ bloco: user.bloco });
        
        // Se tem apartamento, aguarda carregar apartamentos e preenche
        if (user.apartamento) {
          await new Promise(resolve => setTimeout(resolve, 300));
          this.condominioForm.patchValue({ apartamento: user.apartamento });
        }
        
        console.log('✅ Bloco e apartamento preenchidos automaticamente');
      }
    } catch (error) {
      console.error('❌ Erro ao preencher bloco/apartamento:', error);
    }
  }

  /**
   * Quando seleciona um bloco
   */
  private async onBlocoChange(blocoId: string): Promise<void> {
    try {
      // Limpa apartamentos
      this.apartamentoOptions = [];
      this.condominioForm.get('apartamento')?.disable();  // ✅ Desabilita
      this.condominioForm.patchValue({ apartamento: '' }, { emitEvent: false });
      
      // Carrega apartamentos
      const token = this.getToken();
      const apartamentos = await this.condominioService.listarApartamentos(
        this.slugAtual, 
        blocoId, 
        token
      );
      
      this.apartamentoOptions = apartamentos.map(apt => ({
        label: apt,
        value: apt
      })).sort((a, b) => parseInt(a.value) - parseInt(b.value)); // ✅ Ordena numericamenteTentar novamente
      
      // ✅ Habilita apartamento se tem opções
      if (this.apartamentoOptions.length > 0) {
        this.condominioForm.get('apartamento')?.enable();
      }

      console.log('✅ Apartamentos carregados:', this.apartamentoOptions.length);
    } catch (error) {
      console.error('❌ Erro ao carregar apartamentos:', error);
      this.showError('Erro', 'Não foi possível carregar os apartamentos.');
    }
  }

  /**
   * Carrega dados do usuário
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

      const user = await this.userService.fetchUserData(userId, token);
      console.log('📦 Dados do usuário carregados:', user);

      if (user && user.nomeCondominio) {
        // Encontra o condomínio pelo nome
        const cond = this.condominios.find(c => 
          c.nome.toLowerCase() === user.nomeCondominio?.toLowerCase()
        );
        
        if (cond) {
          this.slugAtual = cond.slug;
          this.condominioSelecionado = cond;
          
          // Carrega blocos
          await this.onCondominioChange(cond.slug);
          
          // Aguarda um pouco para garantir que blocos foram carregados
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Preenche formulário
          this.condominioForm.patchValue({
            condominio: cond.slug,
            bloco: user.bloco || '',
            apartamento: user.apartamento || ''
          }, { emitEvent: false });
          
          // Se tem bloco, carrega apartamentos
          if (user.bloco) {
            await this.onBlocoChange(user.bloco);
          }
        }
      }

      this.condominioForm.markAllAsTouched();
      this.condominioForm.updateValueAndValidity();
      
      console.log('✅ Formulário preenchido:', this.condominioForm.value);

    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error);
      this.showError('Erro', 'Não foi possível carregar seus dados.');
    } finally {
      this.carregandoDados = false;
    }
  }

  async salvarCondominio(): Promise<void> {
    if (this.condominioForm.invalid) {
      this.markFormGroupTouched(this.condominioForm);
      this.showWarning('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.loading = true;

    try {
      const dados = this.condominioForm.value;
      const userId = this.getUserId();
      const token = this.getToken();
      const posicaoAtual = 3;
      const novaPosicao = posicaoAtual + 1;

      console.log('📄 Salvando dados do condomínio...');

      await this.http.patch(
        `${this.apiBaseUrl}/users/${userId}/posicao-cadastro`,
        { 
          posicaoCadastroComplementar: novaPosicao,
          pais: this.condominioSelecionado?.pais || 'BRASIL',
          estado: this.condominioSelecionado?.estado || 'RN',
          nomeCondominio: this.condominioSelecionado?.nome || '',
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

      // Atualiza cache local
      const usuarioAtual = this.userService.getCurrentUser();
      if (usuarioAtual) {
        usuarioAtual.posicaoCadastroComplementar = novaPosicao;
        usuarioAtual.pais = this.condominioSelecionado?.pais || 'BRASIL';
        usuarioAtual.estado = this.condominioSelecionado?.estado || 'RN';
        usuarioAtual.nomeCondominio = this.condominioSelecionado?.nome || '';
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