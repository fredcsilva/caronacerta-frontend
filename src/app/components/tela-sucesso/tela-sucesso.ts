import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HapticService } from '../../services/haptic.service';

export interface SuccessConfig {
  title: string;
  message: string;
  buttonText: string;
  buttonRoute: string;
  showBackButton?: boolean;
  backRoute?: string;
}

@Component({
  selector: 'app-tela-sucesso',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  templateUrl: './tela-sucesso.html',
  styleUrl: './tela-sucesso.css'
})
export class TelaSucessoComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private haptic = inject(HapticService);

  config: SuccessConfig = {
    title: 'Usuário(a) Criado(a)!',
    message: '<em>Só falta uma etapa....</em><br><br>Acesse o seu <i class="pi pi-envelope"></i> <strong>e-mail</strong> e complete a criação do usuário.',
    buttonText: 'Faça Login, agora!',
    buttonRoute: '/login',
    showBackButton: true,
    backRoute: '/novo-usuario'
  };

  ngOnInit() {
    // Obtém configuração passada via state do router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.config = { ...this.config, ...navigation.extras.state };
    }

    // Ou via query params (fallback)
    this.route.queryParams.subscribe(params => {
      if (params['title']) this.config.title = params['title'];
      if (params['message']) this.config.message = params['message'];
      if (params['buttonText']) this.config.buttonText = params['buttonText'];
      if (params['buttonRoute']) this.config.buttonRoute = params['buttonRoute'];
      if (params['backRoute']) this.config.backRoute = params['backRoute'];
    });
  }

  goToNextPage() {
    this.haptic.lightTap();
    this.router.navigate([this.config.buttonRoute]);
  }

  goBack() {
    this.haptic.lightTap();
    if (this.config.backRoute) {
      this.router.navigate([this.config.backRoute]);
    }
  }
}