import { Routes } from '@angular/router';

export const CARONAS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full'
  },
  {
    path: 'listar',
    loadComponent: () => 
      import('./pages/carona-page-listar/carona-page-listar.component')
        .then(m => m.CaronaPageListarComponent)
  }
];