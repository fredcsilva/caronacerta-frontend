import { Routes } from '@angular/router';

export const CADASTRO_COMPLEMENTAR_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'boas-vindas',
    pathMatch: 'full'
  },
  {
    path: 'boas-vindas',
    loadComponent: () => 
      import('./pages/cadastro-page-boas-vindas/cadastro-complementar-page-boas-vindas.component')
        .then(m => m.CadastroComplementarPageBoasVindasComponent)
  },
  {
    path: 'dados-pessoais',
    loadComponent: () => 
      import('./pages/cadastro-page-dados-pessoais/cadastro-complementar-page-dados-pessoais.component')
        .then(m => m.CadastroComplementarPageDadosPessoaisComponent)
  },
  {
    path: 'condominio',
    loadComponent: () => 
      import('./pages/cadastro-page-condominio/cadastro-complementar-page-condominio.component')
        .then(m => m.CadastroComplementarPageCondominioComponent)
  },
  {
    path: 'termos',
    loadComponent: () => 
      import('./pages/cadastro-page-termos/cadastro-complementar-page-termos.component')
        .then(m => m.CadastroComplementarPageTermosComponent)
  },
  {
    path: 'sucesso',
    loadComponent: () => 
      import('./pages/cadastro-page-sucesso/cadastro-complementar-page-sucesso.component')
        .then(m => m.CadastroComplementarPageSucessoComponent)
  }
];