import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule, CarouselPageEvent } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HapticService } from '../../../core/services/haptic.service';

@Component({
  selector: 'app-boas-vindas',
  standalone: true,
  imports: [CarouselModule, ButtonModule, RippleModule],
  templateUrl: './boas-vindas-page.component.html',
  styleUrl: './boas-vindas-page.component.css'
})
export class BoasVindasPageComponent {
  private router = inject(Router);
  private haptic = inject(HapticService);
  currentPage: number = 0;
  private isUserInteraction: boolean = false;
  
  slides = [
    {
      id: 1,
      image: 'assets/images/slide1.png',
      title: 'Compartilhe Caronas',
      description: 'Suas caronas financiam as melhorias que todos aprovam.'
    },
    {
      id: 2,
      image: 'assets/images/slide2.png',
      title: 'Ganhe Dinheiro',
      description: 'Motoristas podem ganhar uma renda extra oferecendo caronas para moradores do condomínio.'
    },
    {
      id: 3,
      image: 'assets/images/slide3.png',
      title: 'Economize Dinheiro',
      description: 'Passageiros podem reduzir custos com mais segurança e conforto.'
    },
    {
      id: 4,
      image: 'assets/images/slide4.png',
      title: 'Seguro e Confiável',
      description: 'Viaje com tranquilidade sabendo que está entre vizinhos conhecidos e verificados.'
    },
    {
      id: 5,
      image: 'assets/images/slide5.png',
      title: 'Projetos, Melhorias e Transformação',
      description: 'A partir de colcaboração a transformação acontece. E todos no condomínio agradecem!'
    }
  ];

  goToLogin() {
    this.haptic.lightTap();
    this.router.navigate(['/login']);
  }

  onPageChange(event: CarouselPageEvent) {
    this.currentPage = event.page ?? 0;
    if (this.isUserInteraction) {
      this.haptic.lightTap();
      this.isUserInteraction = false;
    }
  }

  nextSlide() {
    this.isUserInteraction = true;
    this.currentPage = (this.currentPage + 1) % this.slides.length;
  }

  prevSlide() {
    this.isUserInteraction = true;
    this.currentPage = this.currentPage === 0 ? this.slides.length - 1 : this.currentPage - 1;
  }
}
