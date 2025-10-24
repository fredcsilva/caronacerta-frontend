import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { HapticService } from '../../../core/services/haptic.service';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { EncryptionService } from '../../../core/services/encryption.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    MessageModule
  ],
  templateUrl: './auth-page-login.component.html',
  styleUrl: './auth-page-login.component.css'
})
export class AuthPageLoginComponent implements OnInit {
  private router = inject(Router);
  private haptic = inject(HapticService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private encryptionService = inject(EncryptionService);
  
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  
  showMessage: boolean = false;
  messageText: string = '';
  messageSeverity: 'success' | 'error' | 'info' | 'warn' = 'error';
  
  isLoading: boolean = false;

  ngOnInit() {
    this.loadSavedCredentials();
  }

  private loadSavedCredentials() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const encryptedPassword = localStorage.getItem('rememberedPassword');
    const rememberFlag = localStorage.getItem('rememberMe');

    if (rememberFlag === 'true' && savedEmail && encryptedPassword) {
      console.log('🔐 Credenciais criptografadas encontradas. Descriptografando...');
      
      const decryptedPassword = this.encryptionService.decrypt(encryptedPassword);
      
      if (decryptedPassword) {
        this.email = savedEmail;
        this.password = decryptedPassword;
        this.rememberMe = true;
        console.log('✅ Campos preenchidos com credenciais salvas');
      } else {
        console.warn('⚠️ Falha ao descriptografar senha. Removendo credenciais...');
        this.clearSavedCredentials();
      }
    }
  }

  private handleRememberMe() {
    if (this.rememberMe) {
      const encryptedPassword = this.encryptionService.encrypt(this.password);
      
      if (encryptedPassword) {
        localStorage.setItem('rememberedEmail', this.email);
        localStorage.setItem('rememberedPassword', encryptedPassword);
        localStorage.setItem('rememberMe', 'true');
        console.log('💾 Credenciais salvas (senha criptografada)');
      }
    } else {
      this.clearSavedCredentials();
    }
  }

  private clearSavedCredentials() {
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    localStorage.removeItem('rememberMe');
  }

  onFieldFocus() {
    this.showMessage = false;
    this.messageText = '';
  }

  private showError(message: string) {
    this.showMessage = true;
    this.messageText = message;
    this.messageSeverity = 'error';
    this.haptic.lightTap();
  }

  private showSuccess(message: string) {
    this.showMessage = true;
    this.messageText = message;
    this.messageSeverity = 'success';
    this.haptic.lightTap();
  }

  private validateForm(): boolean {
    if (!this.email || this.email.trim() === '') {
      this.showError('Por favor, informe seu email.');
      return false;
    }

    if (!this.password || this.password.trim() === '') {
      this.showError('Por favor, informe sua senha.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showError('Por favor, informe um email válido.');
      return false;
    }

    return true;
  }

  //efetuando login
  onLogin() {
    this.haptic.lightTap();

    const credentials: LoginRequest = {
      email: this.email,
      password: this.password
    };
    
    this.showMessage = false;
    
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('🚀 Login realizado com sucesso');
        
        // Verifica e-mail confirmado
        if (response.emailVerified === false) {
          this.isLoading = false;
          this.showError('E-mail não verificado. Verifique sua caixa de entrada.');
          return;
        }
        
        // Salva credenciais
        this.handleRememberMe();
        
        // Salva dados no storage
        const storage = this.rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', response.token);
        storage.setItem('userEmail', response.email);
        storage.setItem('userId', response.uid);

        // Salva usuário no cache
        this.userService.setCurrentUser({
          uid: response.uid,
          email: response.email,
          name: response.name,
          role: response.role,
          active: true,
          pendenciaCadastro: response.pendenciaCadastro,
          posicaoCadastroComplementar: response.posicaoCadastroComplementar || 1
        });

        console.log('💾 Dados salvos. Posição:', response.posicaoCadastroComplementar);
        this.showSuccess('Login realizado com sucesso!');

        // ✅ AQUI QUEM REDIRECIONA É O COMPONENTE
        setTimeout(() => {
          this.isLoading = false;
          
          if (response.pendenciaCadastro === true) {
            const posicao = response.posicaoCadastroComplementar || 1;
            console.log(`✅ Redirecionando para posição ${posicao}`);
            
            // Redireciona para a rota correspondente
            const rota = this.getRotaPorPosicao(posicao);
            this.router.navigateByUrl(rota);
          } else {
            console.log('✅ Cadastro completo. Redirecionando para caronas');
            this.router.navigateByUrl('/app/caronas/listar');
          }
        }, 1000);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erro no login:', error);
        this.isLoading = false;
        
        if (error.status === 401 || error.status === 400) {
          this.showError('Login ou Senha incorretos.');
        } else if (error.status === 0) {
          this.showError('Erro de conexão. Verifique sua internet.');
        } else if (error.status === 500) {
          this.showError('Erro no servidor. Tente novamente mais tarde.');
        } else {
          this.showError('Não foi possível efetuar login.');
        }
      }
    });
  }

  /**
   * ✅ Retorna a rota baseada na posição
   */
  private getRotaPorPosicao(posicao: number): string {
    const rotas: Record<number, string> = {
      1: '/app/cadastro-complementar/boas-vindas',
      2: '/app/cadastro-complementar/dados-pessoais',
      3: '/app/cadastro-complementar/condominio',
      4: '/app/cadastro-complementar/termos',
      5: '/app/cadastro-complementar/sucesso'
    };
    return rotas[posicao] || rotas[1];
  }

  goToForgotPassword() {
    this.haptic.lightTap();
    this.router.navigate(['/esqueci-senha']);
  }

  goToNewUser() {
    this.haptic.lightTap();
    this.router.navigate(['/cadastro']);
  }
}