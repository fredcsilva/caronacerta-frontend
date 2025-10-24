// src/app/private/private.routes.ts

import { Routes } from '@angular/router';
import { cadastroComplementarGuard } from '../core/guards/cadastro-complementar.guard';

export const PRIVATE_ROUTES: Routes = [
  {
    path: 'cadastro-complementar',
    loadChildren: () => 
      import('./features/cadastro-complementar/cadastro-complementar.routes')
        .then(m => m.CADASTRO_COMPLEMENTAR_ROUTES),
    canActivate: [cadastroComplementarGuard]  // ← Guard do wizard
  },
  {
    path: 'caronas',
    loadChildren: () => 
      import('./features/caronas/caronas.routes')
        .then(m => m.CARONAS_ROUTES)
  },
  {
    path: '',
    redirectTo: 'caronas',
    pathMatch: 'full'
  }
];