import { Component, OnInit, inject, ViewChild } from '@angular/core';
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
import { FileUpload } from 'primeng/fileupload';
import { Avatar } from 'primeng/avatar';
import { Dialog } from 'primeng/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { HapticService } from '../../../../../core/services/haptic.service';
import { UserService } from '../../../../../core/services/user.service';
import { MenuBarComponent } from '../../../../../shared/components/menu-bar/menu-bar.component';

interface FileUploadEvent {
  files: File[];
}

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
    Toast,
    FileUpload,
    Avatar,
    Dialog,
    MenuBarComponent
  ],
  providers: [MessageService],
  templateUrl: './cadastro-complementar-page-dados-pessoais.component.html',
  styleUrls: ['./cadastro-complementar-page-dados-pessoais.component.css']
})
export class CadastroComplementarPageDadosPessoaisComponent implements OnInit {
  
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  
  dadosPessoaisForm!: FormGroup;
  loading = false;
  carregandoDados = true;
  
  // ✅ Avatar properties
  avatarImageSrc: string | null = null;
  avatarThumbnailSrc: string | null = null;
  selectedFile: File | null = null;
  displayImageModal = false;
  
  // Constantes para validação
  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  readonly ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
  
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
   * ✅ ATUALIZADO: Carrega dados do usuário incluindo avatar
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

      // ✅ NOVO: Busca dados completos incluindo avatar
      const user = await this.userService.fetchUserData(userId, token);
      console.log('📦 Dados do usuário carregados:', user);

      if (user) {
        let dataNascimento: Date | null = null;

        if (user.dataNascimento) {
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

        // ✅ ATUALIZADO: Carrega avatar e thumbnail se existirem
        if (user.avatarUrl) {
          this.avatarImageSrc = user.avatarUrl;
          console.log('🖼️ Avatar carregado');
        }

        if (user.avatarThumbnailUrl) {
          this.avatarThumbnailSrc = user.avatarThumbnailUrl;
          console.log('🖼️ Thumbnail carregado');
        } else if (user.avatarUrl) {
          // Se não tem thumbnail, usa a imagem completa
          this.avatarThumbnailSrc = user.avatarUrl;
        }

        this.dadosPessoaisForm.markAllAsTouched();
        this.dadosPessoaisForm.updateValueAndValidity();

        console.log('✅ Formulário preenchido:', this.dadosPessoaisForm.value);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error);
      this.showError('Erro', 'Não foi possível carregar seus dados. Tente novamente.');
    } finally {
      this.carregandoDados = false;
    }
  }

  configurarDatas(): void {
    this.maxDataNascimento = new Date();
    this.maxDataNascimento.setFullYear(this.maxDataNascimento.getFullYear() - 18);
    
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

  /**
   * ✅ SIMPLIFICADO: Manipula seleção de arquivo
   * Não gera mais thumbnail - backend faz isso
   */
  async onFileSelect(event: FileUploadEvent): Promise<void> {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      
      // Validação de tipo
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.showError('Tipo inválido', 'Por favor, selecione apenas imagens PNG, JPEG ou JPG.');
        this.fileUpload.clear();
        return;
      }

      // Validação de tamanho
      if (file.size > this.MAX_FILE_SIZE) {
        this.showError('Arquivo muito grande', 'O tamanho máximo permitido é 5 MB.');
        this.fileUpload.clear();
        return;
      }

      this.selectedFile = file;

      // ✅ SIMPLIFICADO: Carrega apenas a imagem completa
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          this.avatarImageSrc = e.target.result;
          // ✅ Usa a mesma imagem para thumbnail temporariamente
          this.avatarThumbnailSrc = e.target.result;
        }
      };
      reader.readAsDataURL(file);

      this.showSuccess('Imagem selecionada', 'Foto de perfil carregada com sucesso!');
    }
  }

  /**
   * ✅ Remove avatar selecionado
   */
  removeAvatar(): void {
    this.avatarImageSrc = null;
    this.avatarThumbnailSrc = null;
    this.selectedFile = null;
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
    this.showInfo('Foto removida', 'A foto de perfil foi removida.');
  }

  /**
   * ✅ Abre modal com imagem ampliada
   */
  openImageModal(): void {
    if (this.avatarImageSrc) {
      this.displayImageModal = true;
    }
  }

  /**
   * ✅ ATUALIZADO: Salva dados pessoais
   * Envia apenas imagem original - backend gera thumbnail
   */
  async salvarDadosPessoais(): Promise<void> {
      // ✅ ADICIONAR validação de avatar
    const temAvatarExistente = this.avatarImageSrc && this.avatarImageSrc.startsWith('https://');
    const temAvatarNovo = this.selectedFile !== null;
    
    if (!temAvatarExistente && !temAvatarNovo) {
      this.showWarning('Foto Obrigatória', 'Por favor, selecione uma foto de perfil.');
      return;
    }

    if (this.dadosPessoaisForm.invalid) {
      this.markFormGroupTouched(this.dadosPessoaisForm);
      this.showWarning('Atenção', 'Por favor, preencha todos os campos obrigatórios corretamente.');
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
      const posicaoAtual = 2;
      const novaPosicao = posicaoAtual + 1;

      console.log('🔄 Salvando dados pessoais...');

      // Prepara payload
      const payload: any = { 
        posicaoCadastroComplementar: novaPosicao,
        dataNascimento: dataFormatada,
        telefone: dados.telefone.replace(/\D/g, ''),
        genero: dados.genero
      };

      // ✅ SIMPLIFICADO: Envia apenas a imagem original
      // Backend irá processar e gerar o thumbnail automaticamente
      if (this.selectedFile) {  // Só envia se selecionou NOVO arquivo
        payload.avatarBase64 = this.avatarImageSrc;
        console.log('🖼️ Enviando avatar NOVO para processamento');
      }

      // ❌ REMOVIDO: avatarThumbnailBase64 - não precisa mais enviar
      console.log('📤 Payload:', {
        ...payload,
        avatarBase64: payload.avatarBase64 ? `[${payload.avatarBase64.length} bytes]` : undefined
      });

      // Envia dados para o backend
      const response: any = await this.http.patch(
        `${this.apiUrl}/users/${userId}/posicao-cadastro`,
        payload,
        {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          })
        }
      ).toPromise();

      console.log(`✅ Backend atualizado - Posição: ${novaPosicao}`);

      // ✅ ATUALIZADO: Recarrega dados do usuário para pegar avatar processado
      const userAtualizado = await this.userService.fetchUserData(userId, token);
      
      if (userAtualizado) {
        // Atualiza cache local
        this.userService.setCurrentUser(userAtualizado);
        
        // ✅ Atualiza avatar e thumbnail com versões processadas do backend
        if (userAtualizado.avatarUrl) {
          this.avatarImageSrc = userAtualizado.avatarUrl;
        }
        if (userAtualizado.avatarThumbnailUrl) {
          this.avatarThumbnailSrc = userAtualizado.avatarThumbnailUrl;
        }
        
        console.log(`🔒 Cache local atualizado com avatar processado`);
      }

      this.showSuccess('Sucesso', 'Dados pessoais salvos com sucesso!');

      setTimeout(() => {
        console.log('➡️ Redirecionando para /app/cadastro-complementar/condominio');
        this.router.navigate(['/app/cadastro-complementar/condominio']);
      }, 1500);

    } catch (error: any) {
      console.error('❌ Erro ao salvar dados pessoais:', error);
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