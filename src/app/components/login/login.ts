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
import { HapticService } from '../../services/haptic.service';
import { AuthService } from '../../services/auth.services';
import { CadastroComplementarService } from '../../services/cadastro-complementar-service';
import { UserService } from '../../services/user.service';
import { EncryptionService } from '../../services/encryption.service';
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
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private haptic = inject(HapticService);
  private authService = inject(AuthService);
  private cadastroComplementarService = inject(CadastroComplementarService);
  private userService = inject(UserService);
  private encryptionService = inject(EncryptionService);
  
  // Propriedades do formulário
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  
  // Controle de mensagens
  showMessage: boolean = false;
  messageText: string = '';
  messageSeverity: 'success' | 'error' | 'info' | 'warn' = 'error';
  
  // Controle de loading
  isLoading: boolean = false;

  /**
   * ✅ Carrega credenciais salvas (descriptografadas)
   */
  ngOnInit() {
    this.loadSavedCredentials();
  }

  /**
   * ✅ Carrega email e senha salvos (descriptografa a senha)
   */
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
    } else {
      console.log('ℹ️ Nenhuma credencial salva encontrada.');
    }
  }

  /**
   * ✅ Salva ou remove credenciais (criptografa a senha)
   */
  private handleRememberMe() {
    if (this.rememberMe) {
      // Criptografa a senha
      const encryptedPassword = this.encryptionService.encrypt(this.password);
      
      if (encryptedPassword) {
        localStorage.setItem('rememberedEmail', this.email);
        localStorage.setItem('rememberedPassword', encryptedPassword);
        localStorage.setItem('rememberMe', 'true');
        console.log('💾 Credenciais salvas (senha criptografada)');
      } else {
        console.error('❌ Erro ao criptografar senha');
      }
    } else {
      // Remove credenciais salvas
      this.clearSavedCredentials();
      console.log('🗑️ Credenciais removidas');
    }
  }

  /**
   * ✅ Remove todas as credenciais salvas
   */
  private clearSavedCredentials() {
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    localStorage.removeItem('rememberMe');
  }

  /**
   * Limpa a mensagem quando o usuário interage com os campos
   */
  onFieldFocus() {
    this.showMessage = false;
    this.messageText = '';
  }

  /**
   * Exibe mensagem de erro
   */
  private showError(message: string) {
    this.showMessage = true;
    this.messageText = message;
    this.messageSeverity = 'error';
    this.haptic.lightTap();
  }

  /**
   * Exibe mensagem de sucesso
   */
  private showSuccess(message: string) {
    this.showMessage = true;
    this.messageText = message;
    this.messageSeverity = 'success';
    this.haptic.lightTap();
  }

  /**
   * Valida os campos do formulário
   */
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

  onLogin() {
    this.haptic.lightTap();
    
    // Limpa mensagens anteriores
    this.showMessage = false;
    
    // Valida o formulário
    if (!this.validateForm()) {
      return;
    }

    // Inicia loading
    this.isLoading = true;

    // 🔹 Chama o serviço de autenticação
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('🚀 INÍCIO DO PROCESSAMENTO DE LOGIN');
        console.log('✅ Resposta completa do backend:', JSON.stringify(response, null, 2));
        
        // 🔒 Verifica se o e-mail foi confirmado
        if (response.emailVerified === false) {
          this.isLoading = false;
          this.showError('E-mail não verificado. Verifique sua caixa de entrada e clique no link de confirmação.');
          return;
        }
        
        // ✅ Login bem-sucedido: processa "Lembrar-me" (criptografado)
        this.handleRememberMe();
        
        // 💾 Salva o token e dados do usuário
        const storage = this.rememberMe ? localStorage : sessionStorage;
        
        storage.setItem('token', response.token);
        storage.setItem('userEmail', response.email);
        storage.setItem('userId', response.uid);

        console.log('💾 Dados salvos no storage');

        // ✅ Salva os dados do usuário no currentUser
        this.userService.setCurrentUser({
          uid: response.uid,
          email: response.email,
          name: response.name,
          role: response.role,
          active: true,
          pendenciaCadastro: response.pendenciaCadastro,
          posicaoCadastroComplementar: response.posicaoCadastroComplementar
        });

        console.log('👤 Usuário salvo no cache com posição:', response.posicaoCadastroComplementar);

        // ✅ Exibe mensagem de sucesso
        this.showSuccess('Login realizado com sucesso!');
        
        console.log('⏰ Iniciando setTimeout...');
        
        // ⏳ Aguarda um momento para o usuário ver a mensagem
        setTimeout(() => {
          console.log('🔄 Dentro do setTimeout');
          
          // 🚦 Redireciona conforme o status do cadastro
          console.log('📋 Verificando pendenciaCadastro:', response.pendenciaCadastro);
          console.log('📋 Tipo de pendenciaCadastro:', typeof response.pendenciaCadastro);
          console.log('📍 Posição do cadastro:', response.posicaoCadastroComplementar);
          
          if (response.pendenciaCadastro === true) {
            console.log('✅ ENTROU NO IF - Cadastro incompleto!');
            
            const posicao = response.posicaoCadastroComplementar || 1;
            console.log(`🎯 Redirecionando para posição ${posicao}`);
            
            this.cadastroComplementarService.redirecionarParaPosicao(posicao);
            
          } else {
            console.log('❌ ENTROU NO ELSE - Cadastro completo!');
            console.log('⚠️ Redirecionando para /listar-caronas');
            this.router.navigate(['/listar-caronas']);
          }
          
          this.isLoading = false;
          console.log('🏁 FIM DO PROCESSAMENTO');
        }, 1000);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erro no login:', error);
        this.isLoading = false;
        
        // ⚠️ Trata diferentes tipos de erro
        if (error.status === 401 || error.status === 400) {
          this.showError('Não foi possível efetuar login. Login ou Senha incorretos.');
        } else if (error.status === 0) {
          this.showError('Erro de conexão. Verifique sua internet e tente novamente.');
        } else if (error.status === 500) {
          this.showError('Erro no servidor. Tente novamente mais tarde.');
        } else {
          this.showError('Não foi possível efetuar login. Login ou Senha incorretos.');
        }
      }
    });
  }

  /**
   * Navega para a tela de recuperação de senha
   */
  goToForgotPassword() {
    this.haptic.lightTap();
    this.router.navigate(['/esqueci-senha']);
  }

  /**
   * Navega para a tela de novo usuário (cadastro)
   */
  goToNewUser() {
    this.haptic.lightTap();
    this.router.navigate(['/novo-usuario']);
  }
}