import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { HapticService } from '../../services/haptic.service';

interface Genero {
  label: string;
  value: string;
}

interface Condominio {
  id: number;
  nome: string;
}

interface Bloco {
  id: number;
  nome: string;
}

interface Apartamento {
  id: number;
  numero: string;
}

@Component({
  selector: 'app-cadastro-complementar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepperModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    DatePickerModule,
    InputMaskModule,
    SelectModule,
    AutoCompleteModule,
    FileUploadModule,
    AccordionModule,
    CheckboxModule
  ],
  templateUrl: './cadastro-complementar.html',
  styleUrl: './cadastro-complementar.css'
})
export class CadastroComplementarComponent {
  private router = inject(Router);
  private haptic = inject(HapticService);

  minDataNascimento!: Date;
  maxDataNascimento!: Date;

  // Controle do stepper
  activeStep: number = 1;

  // Etapa 1: Dados Pessoais
  fotoPerfil: any = null;
  dataNascimento: Date | null = null;
  telefone: string = '';
  generoSelecionado: Genero | null = null;


  generos: Genero[] = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Feminino', value: 'feminino' },
    { label: 'Outro', value: 'outro' },
    { label: 'Prefiro não informar', value: 'nao_informar' }
  ];

  // Etapa 2: Dados do Condomínio
  condominioSelecionado: Condominio | null = null;
  blocoSelecionado: Bloco | null = null;
  apartamentoSelecionado: Apartamento | null = null;

  // Mock de dados - substituir por API futuramente
  condominios: Condominio[] = [
    { id: 1, nome: 'Residencial Parque das Flores' },
    { id: 2, nome: 'Condomínio Vista Verde' },
    { id: 3, nome: 'Edifício Bella Vista' }
  ];

  blocos: Bloco[] = [];
  apartamentos: Apartamento[] = [];

  // Etapa 3: Termos
  aceitouTermos: boolean = false;
  aceitouPrivacidade: boolean = false;

  ngOnInit(): void {
    // Configurar datas de nascimento válidas
    // Idade mínima: 18 anos (data máxima permitida)
    this.maxDataNascimento = new Date();
    this.maxDataNascimento.setFullYear(this.maxDataNascimento.getFullYear() - 18);
    
    // Idade máxima: 100 anos (data mínima permitida)
    this.minDataNascimento = new Date();
    this.minDataNascimento.setFullYear(this.minDataNascimento.getFullYear() - 100);
    
    // ... resto do código do ngOnInit ...
  }
  /**
   * Upload de foto (simulado)
   */
  onUploadFoto(event: any) {
    this.haptic.lightTap();
    // TODO: Implementar upload real
    this.fotoPerfil = event.files[0];
    console.log('Foto selecionada:', this.fotoPerfil);
  }

  /**
   * Ao selecionar condomínio, carrega blocos
   */
  onCondominioChange() {
    this.haptic.lightTap();
    
    if (!this.condominioSelecionado) {
      this.blocos = [];
      this.apartamentos = [];
      this.blocoSelecionado = null;
      this.apartamentoSelecionado = null;
      return;
    }

    // TODO: Substituir por chamada API real
    // Mock de dados baseado no condomínio selecionado
    this.blocos = [
      { id: 1, nome: 'Bloco A' },
      { id: 2, nome: 'Bloco B' },
      { id: 3, nome: 'Bloco C' }
    ];
    
    this.apartamentos = [];
    this.blocoSelecionado = null;
    this.apartamentoSelecionado = null;
  }

  /**
   * Ao selecionar bloco, carrega apartamentos
   */
  onBlocoChange() {
    this.haptic.lightTap();
    
    if (!this.blocoSelecionado) {
      this.apartamentos = [];
      this.apartamentoSelecionado = null;
      return;
    }

    // TODO: Substituir por chamada API real
    // Mock de dados baseado no bloco selecionado
    this.apartamentos = [
      { id: 1, numero: '101' },
      { id: 2, numero: '102' },
      { id: 3, numero: '103' },
      { id: 4, numero: '201' },
      { id: 5, numero: '202' },
      { id: 6, numero: '203' }
    ];
    
    this.apartamentoSelecionado = null;
  }

  /**
   * Validação Etapa 1
   */
  validarEtapa1(): boolean {
    return !!(this.dataNascimento && this.telefone && this.generoSelecionado);
  }

  /**
   * Validação Etapa 2
   */
  validarEtapa2(): boolean {
    return !!(this.condominioSelecionado && this.blocoSelecionado && this.apartamentoSelecionado);
  }

  validarEtapa3(): boolean {
    return this.aceitouTermos && this.aceitouPrivacidade;
  }

  /**
   * Finalizar cadastro complementar
   */
  onFinalizarCadastro() {
    this.haptic.lightTap();

    if (!this.validarEtapa3()) {
      console.warn('Você precisa aceitar os termos e condições');
      // TODO: Adicionar toast de erro
      return;
    }

    // TODO: Enviar dados para API/Firebase
    console.log('Cadastro complementar finalizado:', {
      dataNascimento: this.dataNascimento,
      telefone: this.telefone,
      genero: this.generoSelecionado,
      condominio: this.condominioSelecionado,
      bloco: this.blocoSelecionado,
      apartamento: this.apartamentoSelecionado,
      termosAceitos: this.aceitouTermos,
      privacidadeAceita: this.aceitouPrivacidade
    });

    // Navegar para tela de sucesso (que será a etapa 4 do stepper)
  }

  /**
   * Ir para listar caronas após concluir cadastro
   */
  onIrParaListarCaronas() {
    this.haptic.lightTap();
    this.router.navigate(['/listar-caronas']);
  }
}