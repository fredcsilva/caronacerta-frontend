// src/app/private/features/caronas/pages/carona-page-listar/carona-page-listar.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { BottomNavComponent } from '../../../../layout/bottom-nav/bottom-nav.component';
import { CardCaronaComponent } from '../../../../../shared/components/card-carona/card-carona';
import { MenuBarComponent } from '../../../../../shared/components/menu-bar/menu-bar.component'; // ✅ NOVO
import { Carona } from '../../models/carona.model';
import { CaronaService } from '../../services/carona.service';
import { MessageService } from 'primeng/api';
import { HapticService } from '../../../../../core/services/haptic.service';

@Component({
  selector: 'app-carona-page-listar',
  standalone: true,
  imports: [
    CommonModule,
    DockModule,
    TooltipModule,
    RippleModule,
    BottomNavComponent,
    CardCaronaComponent,
    MenuBarComponent // ✅ NOVO
  ],
  providers: [MessageService],
  templateUrl: './carona-page-listar.component.html',
  styleUrls: ['./carona-page-listar.component.css']
})
export class CaronaPageListarComponent implements OnInit {
  dockItems: MenuItem[] = [];
  caronas: Carona[] = [];
  loading: boolean = false;

  private haptic = inject(HapticService);

  constructor(
    private caronaService: CaronaService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.configurarDockItems();
    this.carregarMockCaronas();
    this.carregarCaronas();
  }

  private configurarDockItems(): void {
    this.dockItems = [
      { 
        label: 'Caronas', 
        icon: 'pi pi-car', 
        tooltipOptions: { tooltipLabel: 'Minhas Caronas' },
        command: () => this.router.navigate(['/app/caronas/listar'])
      },
      { 
        label: 'Histórico', 
        icon: 'pi pi-history', 
        tooltipOptions: { tooltipLabel: 'Histórico' }
      },
      { 
        label: 'Nova Carona', 
        icon: 'pi pi-plus-circle', 
        tooltipOptions: { tooltipLabel: 'Nova Carona' }, 
        styleClass: 'destaque',
        command: () => this.irParaNova()
      },
      { 
        label: 'Solicitações', 
        icon: 'pi pi-file-check', 
        tooltipOptions: { tooltipLabel: 'Solicitações' }
      },
      { 
        label: 'Menu', 
        icon: 'pi pi-bars', 
        tooltipOptions: { tooltipLabel: 'Menu' }
      }
    ];
  }

  private carregarCaronas(): void {
    this.loading = true;
    
    this.caronaService.listar().subscribe({
      next: (caronas) => {
        console.log('✅ Caronas recebidas do backend:', caronas);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar caronas:', err);
        this.loading = false;
      }
    });
  }

  private carregarMockCaronas(): void {
    this.caronas = [
      {
        id: 1,
        data: '16/10',
        hora: '08:30',
        origem: 'Bloco A',
        destino: 'Shopping Midway',
        valor: 10,
        nome: 'Carlos Souza',
        avaliacao: 4.7,
        bloco: 'A',
        apto: '103'
      },
      {
        id: 2,
        data: '16/10',
        hora: '17:00',
        origem: 'Shopping Midway',
        destino: 'Bloco A',
        valor: 10,
        nome: 'Mariana Lima',
        avaliacao: 4.9,
        bloco: 'B',
        apto: '204'
      },
      {
        id: 3,
        data: '16/10',
        hora: '17:00',
        origem: 'TJRN',
        destino: 'Res. Jardim Satélite',
        valor: 10,
        nome: 'Fred Silva',
        avaliacao: 4.9,
        bloco: 'B',
        apto: '204'
      }
    ];
  }

  irParaNova(): void {
    this.router.navigate(['/app/caronas/nova']);
  }

  verDetalhes(caronaId: number): void {
    this.router.navigate(['/app/caronas', caronaId]);
  }

  editar(caronaId: number): void {
    this.router.navigate(['/app/caronas', caronaId, 'editar']);
  }

  deletar(caronaId: number): void {
    if (confirm('Tem certeza que deseja excluir esta carona?')) {
      this.caronaService.deletar(caronaId).subscribe({
        next: () => {
          this.carregarCaronas();
          alert('Carona excluída com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao deletar carona:', err);
          alert('Erro ao excluir carona');
        }
      });
    }
  }

  logout(): void {
    this.haptic.lightTap();
    
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');

    console.log('✅ Logout realizado');
    
    this.messageService.add({
      severity: 'info',
      summary: 'Logout',
      detail: 'Você saiu do sistema.',
      life: 2000
    });

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }
}