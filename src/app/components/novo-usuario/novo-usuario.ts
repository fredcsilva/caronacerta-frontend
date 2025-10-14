import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService, RegisterRequest } from '../../services/auth.services';
import { HapticService } from '../../services/haptic.service';

@Component({
  selector: 'app-novo-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ProgressSpinnerModule
  ],
  templateUrl: './novo-usuario.html',
  styleUrl: './novo-usuario.css'
})
export class NovoUsuarioComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private haptic = inject(HapticService);

  nomeCompleto = '';
  email = '';
  senha = '';
  messages: any[] = [];
  isLoading = false;
  hideTimeout: any;

  onConfirmar() {
    this.haptic.lightTap();
    this.clearMessages();

    if (!this.nomeCompleto.trim() || !this.email.trim() || !this.senha.trim()) {
      this.showMessage('warn', 'Todos os campos são obrigatórios.');
      return;
    }

    if (!this.nomeCompleto.includes(' ')) {
      this.showMessage('warn', 'Informe o nome completo (nome e sobrenome).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showMessage('warn', 'E-mail inválido.');
      return;
    }

    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!senhaRegex.test(this.senha)) {
      this.showMessage('warn', 'A senha deve conter 8 caracteres, números e letras (com ao menos uma maiúscula).');
      return;
    }

    const data: RegisterRequest = {
      name: this.nomeCompleto.trim(),
      email: this.email.trim(),
      password: this.senha.trim()
    };

    this.isLoading = true;

    this.authService.register(data).subscribe({
      next: (res) => {
        console.log('✅ Usuário criado! Resposta:', res);
        this.isLoading = false;
        this.haptic.mediumTap();
        
        console.log('🚀 Navegando para /tela-sucesso...');
        // Navega para tela de sucesso com configuração personalizada
        this.router.navigate(['/tela-sucesso'], {
          state: {
            title: 'Novo usuário criado com sucesso!',
            message: 'Acesse o seu e-mail para confirmar e finalizar a criação do usuário.',
            buttonText: 'Faça seu Login, agora!',
            buttonRoute: '/login',
            showBackButton: true,
            backRoute: '/novo-usuario'
          }
        });
        
        // Limpa os campos para caso o usuário volte
        this.nomeCompleto = '';
        this.email = '';
        this.senha = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.haptic.heavyTap();

        let msg = 'Erro ao registrar usuário. Tente novamente.';
        if (err.status === 400 && typeof err.error === 'object') {
          // Trata o ValidationException: err.error -> { campo: mensagem }
          msg = Object.values(err.error).join(' | ');
        } else if (err?.error?.message) {
          msg = err.error.message;
        } else if (typeof err.error === 'string') {
          msg = err.error;
        }

        this.showMessage('error', msg);
      }
    });
  }

  goToLogin() {
    this.haptic.lightTap();
    this.router.navigate(['/login']);
  }

  /** ✅ Limpa mensagens manualmente (ao clicar em qualquer campo) */
  clearMessages() {
    if (this.messages.length > 0) {
      clearTimeout(this.hideTimeout);
      this.messages = [];
    }
  }

  /** ✅ Mostra mensagem temporária (5 segundos) */
  private showMessage(severity: string, detail: string) {
    this.messages = [{ severity, detail }];
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.messages = [];
    }, 5000);
  }
}