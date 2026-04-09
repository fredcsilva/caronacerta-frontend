import { Routes } from '@angular/router';
import { BoasVindasComponent } from './pages/boas-vindas/boas-vindas';

export const BOAS_VINDAS_ROUTES: Routes = [
  {
    path: '',
    component: BoasVindasComponent,
    data: { animation: 'BoasVindasPage' }
  }
];