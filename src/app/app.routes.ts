import { Routes } from '@angular/router';

// ✅ Importar o Guard
import { cadastroComplementarGuard } from './core/guards/cadastro-complementar.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => 
      import('./public/public.routes')
        .then(m => m.PUBLIC_ROUTES)
  },
  {
    path: 'app',
    loadChildren: () => 
      import('./private/private.routes')       // ← Importa daqui
        .then(m => m.PRIVATE_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
