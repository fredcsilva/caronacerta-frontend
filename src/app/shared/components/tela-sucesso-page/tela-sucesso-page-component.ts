import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HapticService } from '../../../core/services/haptic.service';

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
  imports: [
    CommonModule, 
    ButtonModule, 
    RippleModule
  ],
  templateUrl: './tela-sucesso-page-component.html',
  styleUrls: ['./tela-sucesso-page-component.css']

})
export class TelaSucessoPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private haptic = inject(HapticService);

  config: SuccessConfig = {
    title: 'Processo Realizado com Sucesso!',
    message: '',
    buttonText: 'Faça Login, agora!',
    buttonRoute: '/login',
    showBackButton: true,
    backRoute: '/cadastro'
  };

 ngOnInit() {
  const navigation = this.router.getCurrentNavigation();
  const stateData = navigation?.extras?.state as Partial<SuccessConfig> | undefined;

  if (stateData) {
    this.config = { ...this.config, ...stateData };
  } else {
    // Fallback via history.state (em caso de reload/F5)
    const historyState = window.history.state as Partial<SuccessConfig>;
    if (historyState && Object.keys(historyState).length > 0) {
      this.config = { ...this.config, ...historyState };
    }
  }

  // Também mantém o fallback de query params
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