import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MenuBarComponent } from '../menu-bar/menu-bar'; // ✅ ADICIONAR

@Component({
  selector: 'app-listar-caronas',
  standalone: true,
  imports: [
    CommonModule,
    Toast,
    MenuBarComponent // ✅ ADICIONAR
  ],
  providers: [MessageService],
  templateUrl: './listar-caronas.html',
  styleUrl: './listar-caronas.css'
})
export class ListarCaronasComponent implements OnInit {
  
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    console.log('📋 Página Listar Caronas carregada');
  }
}