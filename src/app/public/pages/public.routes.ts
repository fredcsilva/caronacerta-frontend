import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./boas-vindas-page/boas-vindas')
        .then(m => m.BoasVindasComponent)
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./auth-page-login/auth-page-login.component')
        .then(m => m.AuthPageLoginComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => 
      import('./auth-page-novo-usuario/auth-page-novo-usuario.component')
        .then(m => m.AuthPageNovoUsuarioComponent)
  },
  {
    path: 'esqueci-senha',
    loadComponent: () => 
      import('./auth-page-esqueci-senha/auth-page-esqueci-senha.component')
        .then(m => m.AuthPageEsqueciSenhaComponent)
  },
  {
    path: 'alterar-senha',
    loadComponent: () => 
      import('./auth-page-alterar-senha/auth-page-alterar-senha.component')
        .then(m => m.AuthPageAlterarSenhaComponent)
  }
];