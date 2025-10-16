import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitterModule } from 'primeng/splitter';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';

interface NavItem {
  label: string;
  icon: string;
  tooltip: string;
  isDestaque?: boolean;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, SplitterModule, TooltipModule, DividerModule],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css']
})
export class BottomNavComponent implements OnInit {
  navItems: NavItem[] = [];
  activeIndex: number | null = null;

  ngOnInit(): void {
    this.navItems = [
      { 
        label: 'Caronas', 
        icon: 'pi pi-car', 
        tooltip: 'Minhas Caronas' 
      },
      { 
        label: 'Histórico', 
        icon: 'pi pi-history', 
        tooltip: 'Histórico' 
      },
      { 
        label: 'Nova', 
        icon: 'pi pi-plus-circle', 
        tooltip: 'Nova Carona',
        isDestaque: true 
      },
      { 
        label: 'Projetos', 
        icon: 'pi pi-file-check', 
        tooltip: 'Projetos' 
      },
      { 
        label: 'Menu', 
        icon: 'pi pi-bars', 
        tooltip: 'Menu' 
      }
    ];
  }

  onItemClick(item: NavItem, index: number): void {
    this.activeIndex = index;
    console.log('Navegando para:', item.label);
    // Adicione aqui a lógica de navegação com Router
    // this.router.navigate(['/rota-correspondente']);
  }
}