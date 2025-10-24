import { Component, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HapticService } from '../../../core/services/haptic.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    MessageModule,
    ProgressSpinnerModule
  ],
  templateUrl: './auth-page-esqueci-senha.component.html',
  styleUrls: ['./auth-page-esqueci-senha.component.css']
})
export class AuthPageEsqueciSenhaComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private haptic = inject(HapticService);
  private ngZone = inject(NgZone);

  email = '';
  messages: any[] = [];
  isLoading = false;
  hideTimeout: any;

  onEnviarCodigo() {
    this.haptic.lightTap();
    this.clearMessages();

    if (!this.email.trim()) {
      this.showMessage('warn', 'Por favor, informe seu e-mail.');
      return;
    }

    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.showMessage('error', 'Por favor, informe um e-mail válido.');
      return;
    }

    this.isLoading = true;

    this.authService.forgotPassword(this.email.trim()).subscribe({
      next: (response) => {
        console.log('✅ Código enviado:', response);
        this.isLoading = false;
        this.haptic.mediumTap();

        this.showMessage('success', 'Código enviado com sucesso!');

        console.log('📧 Navegando para alterar-senha com:', this.email);

        this.ngZone.run(() => {
          this.router.navigate(['/alterar-senha'], {
            state: { email: this.email.trim() }
          });
        });
      },
      error: (err) => {
        console.error('❌ Erro ao enviar código:', err);
        this.isLoading = false;
        this.haptic.heavyTap();

        let msg = 'Erro ao enviar código. Tente novamente.';

        if (err.error) {
          if (typeof err.error === 'string') {
            msg = err.error;
          } else if (err.error.message) {
            msg = err.error.message;
          } else if (err.error.erro) {
            msg = err.error.erro;
          }
        } else if (err.message) {
          msg = err.message;
        }

        if (err.status === 0) {
          msg = 'Erro de conexão. Verifique sua internet.';
        } else if (err.status === 404) {
          msg = 'Usuário não encontrado com este e-mail.';
        }

        this.showMessage('error', msg);
      }
    });
  }

  goToLogin() {
    this.haptic.lightTap();
    this.router.navigate(['/login']);
  }

  clearMessages() {
    if (this.messages.length > 0) {
      clearTimeout(this.hideTimeout);
      this.messages = [];
    }
  }

  private showMessage(severity: string, detail: string) {
    this.messages = [{ severity, detail }];
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.messages = [];
    }, 5000);
  }
}
