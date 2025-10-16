import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-listar-caronas',
  standalone: true,
  imports: [CommonModule, DockModule, TooltipModule, RippleModule, BottomNavComponent],
  templateUrl: './listar-caronas.html',
  styleUrls: ['./listar-caronas.css']
})
export class ListarCaronasComponent implements OnInit {
  dockItems: MenuItem[] = [];

  ngOnInit(): void {
    this.dockItems = [
      { label: 'Caronas', icon: 'pi pi-car', tooltipOptions: { tooltipLabel: 'Minhas Caronas' } },
      { label: 'Histórico', icon: 'pi pi-history', tooltipOptions: { tooltipLabel: 'Histórico' } },
      { label: 'Nova Carona', icon: 'pi pi-plus-circle', tooltipOptions: { tooltipLabel: 'Nova Carona' }, styleClass: 'destaque' },
      { label: 'Solicitações', icon: 'pi pi-file-check', tooltipOptions: { tooltipLabel: 'Solicitações' } },
      { label: 'Menu', icon: 'pi pi-bars', tooltipOptions: { tooltipLabel: 'Menu' } }
    ];
  }
}
