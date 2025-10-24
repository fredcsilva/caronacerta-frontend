import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // ✅ Import adicionado
import { HapticService } from '../../../core/services/haptic.service';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-alterar-senha',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ProgressSpinnerModule // ✅ Incluído aqui
  ],
  templateUrl: './auth-page-alterar-senha.component.html',
  styleUrls: ['./auth-page-alterar-senha.component.css']
})
export class AuthPageAlterarSenhaComponent implements OnInit {
  private router = inject(Router);
  private haptic = inject(HapticService);
  private authService = inject(AuthService);

  email: string = '';
  codigo: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';
  isLoading = false;
  message = '';

  ngOnInit() {
    const nav = history.state;
    this.email = nav?.email || '';
    console.log('📨 E-mail recebido:', this.email);
  }

  onAlterarSenha() {
    this.haptic.lightTap();
    this.message = '';

    if (!this.email || !this.codigo || !this.novaSenha || !this.confirmarSenha) {
      this.message = 'Preencha todos os campos.';
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.message = 'As senhas não conferem.';
      return;
    }

    if (this.codigo.length !== 6) {
      this.message = 'O código deve ter 6 dígitos.';
      return;
    }

    this.isLoading = true;

    const body = {
      email: this.email,
      codigo: this.codigo,
      novaSenha: this.novaSenha
    };

    this.authService.alterarSenha(this.email, this.codigo, this.novaSenha).subscribe({      
      next: (res) => {
        console.log('✅ Senha alterada com sucesso:', res);
        this.isLoading = false;
        this.haptic.mediumTap();
        this.router.navigate(['/tela-sucesso']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Erro ao alterar senha:', err);
        this.isLoading = false;
        this.haptic.heavyTap();
        this.message = 'Erro ao alterar senha. Verifique os dados e tente novamente.';
      }
    });
  }

  voltarLogin() {
    this.haptic.lightTap();
    this.router.navigate(['/login']);
  }
}
