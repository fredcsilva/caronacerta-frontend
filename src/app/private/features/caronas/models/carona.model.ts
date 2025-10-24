// src/app/private/features/caronas/models/carona.model.ts

export interface Carona {
  id?: number;
  data: string;          // '16/10'
  hora: string;          // '08:30'
  origem: string;        // 'Bloco A'
  destino: string;       // 'Shopping Midway'
  valor: number;         // 10
  nome: string;          // 'Carlos Souza' (motorista)
  avaliacao: number;     // 4.7
  bloco: string;         // 'A'
  apto: string;          // '103'
  vagas?: number;        // quantidade de vagas
  vagasOcupadas?: number; // vagas já ocupadas
  observacoes?: string;
  telefone?: string;
  status?: StatusCarona;
  criadoEm?: string;
  atualizadoEm?: string;
}

export enum StatusCarona {
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

// DTO para criar carona
export interface CreateCaronaDTO {
  data: string;
  hora: string;
  origem: string;
  destino: string;
  valor: number;
  vagas: number;
  observacoes?: string;
}

// DTO para editar carona
export interface UpdateCaronaDTO extends Partial<CreateCaronaDTO> {
  status?: StatusCarona;
}