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
  }/*,
  {
    path: 'nova',
    loadComponent: () => 
      import('./pages/carona-page-criar/carona-page-criar.component')
        .then(m => m.CaronaPageCriarComponent)
  },
  {
    path: ':id',
    loadComponent: () => 
      import('./pages/carona-page-detalhes/carona-page-detalhes.component')
        .then(m => m.CaronaPageDetalhesComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => 
      import('./pages/carona-page-editar/carona-page-editar.component')
        .then(m => m.CaronaPageEditarComponent)
  }*/
];