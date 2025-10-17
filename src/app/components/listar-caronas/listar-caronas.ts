import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { CardCaronaComponent, CaronaModel } from '../card-carona/card-carona';

@Component({
  selector: 'app-listar-caronas',
  standalone: true,
  imports: [
    CommonModule,
    DockModule,
    TooltipModule,
    RippleModule,
    BottomNavComponent,
    CardCaronaComponent
  ],
  templateUrl: './listar-caronas.html',
  styleUrls: ['./listar-caronas.css']
})
export class ListarCaronasComponent implements OnInit {
  dockItems: MenuItem[] = [];
  caronas: CaronaModel[] = [];

  ngOnInit(): void {
    this.dockItems = [
      { label: 'Caronas', icon: 'pi pi-car', tooltipOptions: { tooltipLabel: 'Minhas Caronas' } },
      { label: 'Histórico', icon: 'pi pi-history', tooltipOptions: { tooltipLabel: 'Histórico' } },
      { label: 'Nova Carona', icon: 'pi pi-plus-circle', tooltipOptions: { tooltipLabel: 'Nova Carona' }, styleClass: 'destaque' },
      { label: 'Solicitações', icon: 'pi pi-file-check', tooltipOptions: { tooltipLabel: 'Solicitações' } },
      { label: 'Menu', icon: 'pi pi-bars', tooltipOptions: { tooltipLabel: 'Menu' } }
    ];

    // Mock de caronas
    this.caronas = [
      {
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
}
