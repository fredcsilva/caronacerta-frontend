// src/app/private/features/caronas/models/carona-filter.model.ts

import { StatusCarona } from './carona.model';

export interface CaronaFilter {
  origem?: string;
  destino?: string;
  data?: string;
  status?: StatusCarona;
  apenasMinhasCaronas?: boolean;
  page?: number;
  pageSize?: number;
}