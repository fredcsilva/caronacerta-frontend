import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { InputMask } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { HapticService } from '../../../../../services/haptic.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-cadastro-complementar-dados-pessoais',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Card,
    DatePicker,
    Select,
    InputMask,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './cadastro-complementar-page-dados-pessoais.component.html',
  styleUrls: ['./cadastro-complementar-page-dados-pessoais.component.css']
})
export class CadastroComplementarPageDadosPessoaisComponent implements OnInit {
  
  dadosPessoaisForm!: FormGroup;
  loading = false;
  carregandoDados = true; // ✅ NOVO: loading para carregamento inicial
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8080/api';
  private haptic = inject(HapticService);
  
  minDataNascimento!: Date;
  maxDataNascimento!: Date;
  
  generoOptions = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Feminino', value: 'FEMININO' },
    { label: 'Outro', value: 'OUTRO' },
    { label: 'Prefiro não informar', value: 'NAO_INFORMAR' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.configurarDatas();
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
        let dataNascimento: Date | null = null;

        if (user.dataNascimento) {
          // Converte string para Date (formato YYYY-MM-DD)
          const partes = user.dataNascimento.split('-');
          if (partes.length === 3) {
            dataNascimento = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
          }
        }

        this.dadosPessoaisForm.patchValue({
          dataNascimento: dataNascimento,
          telefone: user.telefone || '',
          genero: user.genero || ''
        });

        // ✅ Força atualização do estado de validação
        this.dadosPessoaisForm.markAllAsTouched();
        this.dadosPessoaisForm.updateValueAndValidity();

        console.log('✅ Formulário preenchido:', this.dadosPessoaisForm.value);
        console.log('✅ Formulário válido:', this.dadosPessoaisForm.valid);
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

  configurarDatas(): void {
    // Idade mínima: 18 anos (data máxima permitida)
    this.maxDataNascimento = new Date();
    this.maxDataNascimento.setFullYear(this.maxDataNascimento.getFullYear() - 18);
    
    // Idade máxima: 100 anos (data mínima permitida)
    this.minDataNascimento = new Date();
    this.minDataNascimento.setFullYear(this.minDataNascimento.getFullYear() - 100);
  }

  initForm(): void {
    this.dadosPessoaisForm = this.fb.group({
      dataNascimento: [null, Validators.required],
      telefone: ['', [Validators.required, this.telefoneValidator.bind(this)]],
      genero: ['', Validators.required]
    });
  }

  private telefoneValidator(control: any) {
    if (!control.value) return { required: true };
    const somenteNumeros = control.value.replace(/\D/g, '');
    return somenteNumeros.length === 11 ? null : { invalidTelefone: true };
  }

  async salvarDadosPessoais(): Promise<void> {
    if (this.dadosPessoaisForm.invalid) {
      this.markFormGroupTouched(this.dadosPessoaisForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Por favor, preencha todos os campos obrigatórios corretamente.',
        life: 4000
      });
      return;
    }

    this.loading = true;

    try {
      const dados = this.dadosPessoaisForm.value;

      // Formata data para ISO string (YYYY-MM-DD)
      const dataFormatada =
        dados.dataNascimento instanceof Date
          ? dados.dataNascimento.toISOString().split('T')[0]
          : dados.dataNascimento;

      const userId = this.getUserId();
      const token = this.getToken();
      const posicaoAtual = 2; // Esta tela é posição 2
      const novaPosicao = posicaoAtual + 1;

      console.log('🔄 Salvando dados pessoais...');

      // ✅ ÚNICO PONTO DE ATUALIZAÇÃO: Envia tudo junto pro backend
      await this.http.patch(
        `${this.apiUrl}/users/${userId}/posicao-cadastro`,
        { 
          posicaoCadastroComplementar: novaPosicao,
          dataNascimento: dataFormatada,
          telefone: dados.telefone.replace(/\D/g, ''),
          genero: dados.genero
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
        usuarioAtual.dataNascimento = dataFormatada;
        usuarioAtual.telefone = dados.telefone.replace(/\D/g, '');
        usuarioAtual.genero = dados.genero;
        
        this.userService.setCurrentUser(usuarioAtual);
        console.log(`🔒 Cache local atualizado - Posição: ${novaPosicao}`);
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Dados pessoais salvos com sucesso!',
        life: 2000
      });

      setTimeout(() => {
        console.log('➡️ Redirecionando para /cadastro-complementar-condominio');
        this.router.navigate(['/cadastro-complementar-condominio']);
      }, 1500);

    } catch (error: any) {
      console.error('❌ Erro ao salvar dados pessoais:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível salvar os dados. Tente novamente.',
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
}