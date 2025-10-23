import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

export interface CaronaModel {
  data: string;
  hora: string;
  origem: string;
  destino: string;
  valor: number;
  nome: string;
  avaliacao: number;
  bloco: string;
  apto: string;
}

@Component({
  selector: 'app-card-carona',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    ButtonModule
  ],
  templateUrl: './card-carona.html',
  styleUrls: ['./card-carona.css']
})
export class CardCaronaComponent {
  @Input() carona!: CaronaModel;
}
