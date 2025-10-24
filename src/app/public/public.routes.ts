// src/app/public/public.routes.ts

import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/boas-vindas-page/boas-vindas-page.component') 
        .then(m => m.BoasVindasPageComponent) 
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./pages/auth-page-login/auth-page-login.component')
        .then(m => m.AuthPageLoginComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => 
      import('./pages/auth-page-novo-usuario/auth-page-novo-usuario.component')
        .then(m => m.AuthPageNovoUsuarioComponent)
  },
  {
    path: 'esqueci-senha',
    loadComponent: () => 
      import('./pages/auth-page-esqueci-senha/auth-page-esqueci-senha.component')
        .then(m => m.AuthPageEsqueciSenhaComponent)
  },
  {
    path: 'alterar-senha',
    loadComponent: () => 
      import('./pages/auth-page-alterar-senha/auth-page-alterar-senha.component')
        .then(m => m.AuthPageAlterarSenhaComponent)
  },
  {
    path: 'tela-sucesso',
    loadComponent: () => 
      import('../shared/components/tela-sucesso-page/tela-sucesso-page-component')
        .then(m => m.TelaSucessoPageComponent)
  }
];