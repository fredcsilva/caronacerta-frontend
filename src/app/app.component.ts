import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuBarComponent } from './components/menu-bar/menu-bar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'carona-certa-frontend';

  constructor(public router: Router) {
    // Atualiza quando a rota muda
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Força detecção de mudanças quando a rota muda
      });
  }

  /**
   * Verifica se a rota atual tem menu-bar customizado
   * Retorna true para rotas de cadastro complementar
   */
  hasCustomMenuBar(): boolean {
    const customRoutes = [
      '/cadastro-complementar-boas-vindas',
      '/cadastro-complementar-dados-pessoais',
      '/cadastro-complementar-condominio',
      '/cadastro-complementar-termos',
      '/cadastro-complementar-sucesso'
    ];
    
    return customRoutes.includes(this.router.url);
  }
}