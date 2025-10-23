import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HapticService } from '../../../services/haptic.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css'
})
export class MenuBarComponent {
  private router = inject(Router);
  private haptic = inject(HapticService);
  
  // ⭐ Inputs para customização
  @Input() title: string = 'Carona Certa';
  @Input() showBackButton: boolean = false;
  @Input() showLogoutButton: boolean = false;
  @Input() backRoute: string = '/boas-vindas';

  /**
   * Navega para a rota de volta configurada
   */
  goBack() {
    this.haptic.lightTap();
    console.log('Voltando para:', this.backRoute);
    this.router.navigate([this.backRoute]);
  }

  /**
   * Realiza logout e redireciona para login
   */
  logout() {
    this.haptic.lightTap();
    
    // Limpar dados de autenticação
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');

    console.log('Logout realizado');
    
    // Redirecionar para login
    this.router.navigate(['/login']);
  }
}