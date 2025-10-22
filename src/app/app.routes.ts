import { Routes } from '@angular/router';
import { BoasVindasComponent } from './components/boas-vindas/boas-vindas';
import { LoginComponent } from './components/login/login';
import { NovoUsuarioComponent } from './components/novo-usuario/novo-usuario';
import { EsqueciSenhaComponent } from './components/esqueci-senha/esqueci-senha';
import { AlterarSenhaComponent } from './components/alterar-senha/alterar-senha';
import { ListarCaronasComponent } from './components/listar-caronas/listar-caronas';
import { TelaSucessoComponent } from './components/tela-sucesso/tela-sucesso';

// Novos componentes do fluxo de cadastro complementar
import { CadastroComplementarBoasVindasComponent } from './components/cadastro-complementar-boas-vindas/cadastro-complementar-boas-vindas';
import { CadastroComplementarDadosPessoaisComponent } from './components/cadastro-complementar-dados-pessoais/cadastro-complementar-dados-pessoais';
import { CadastroComplementarCondominioComponent } from './components/cadastro-complementar-condominio/cadastro-complementar-condominio';
import { CadastroComplementarTermosComponent } from './components/cadastro-complementar-termos/cadastro-complementar-termos';
import { CadastroComplementarSucessoComponent } from './components/cadastro-complementar-sucesso/cadastro-complementar-sucesso';

// ✅ Importar o Guard
import { cadastroComplementarGuard } from './services/cadastro-complementar.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/boas-vindas', 
    pathMatch: 'full' 
  },
  { 
    path: 'boas-vindas', 
    component: BoasVindasComponent,
    data: { animation: 'BoasVindasPage' }
  },
  { 
    path: 'login', 
    component: LoginComponent,
    data: { animation: 'LoginPage' }
  },
  { 
    path: 'novo-usuario', 
    component: NovoUsuarioComponent,
    data: { animation: 'NovoUsuarioPage' }
  },
  { 
    path: 'tela-sucesso', 
    component: TelaSucessoComponent,
    data: { animation: 'TelaSucessoPage' }
  },
  { 
    path: 'esqueci-senha', 
    component: EsqueciSenhaComponent,
    data: { animation: 'EsqueciSenhaPage' }
  },
  { 
    path: 'alterar-senha', 
    component: AlterarSenhaComponent,
    data: { animation: 'AlterarSenhaPage' }
  },
  
  // ===== FLUXO DE CADASTRO COMPLEMENTAR (PROTEGIDO) =====  
  // ✅ Rotas protegidas pelo guard
  {
    path: 'cadastro-complementar-boas-vindas',
    component: CadastroComplementarBoasVindasComponent,
    canActivate: [cadastroComplementarGuard],
    data: { animation: 'CadastroComplementarBoasVindasPage' }
  },
  {
    path: 'cadastro-complementar-dados-pessoais',
    component: CadastroComplementarDadosPessoaisComponent,
    canActivate: [cadastroComplementarGuard],
    data: { animation: 'CadastroComplementarDadosPessoaisPage' }
  },
  {
    path: 'cadastro-complementar-condominio',
    component: CadastroComplementarCondominioComponent,
    canActivate: [cadastroComplementarGuard],
    data: { animation: 'CadastroComplementarCondominioPage' }
  },
  {
    path: 'cadastro-complementar-termos',
    component: CadastroComplementarTermosComponent,
    canActivate: [cadastroComplementarGuard],
    data: { animation: 'CadastroComplementarTermosPage' }
  },
  {
    path: 'cadastro-complementar-sucesso',
    component: CadastroComplementarSucessoComponent,
    canActivate: [cadastroComplementarGuard],
    data: { animation: 'CadastroComplementarSucessoPage' }
  },
  
  // ===== ROTAS PROTEGIDAS =====
  { 
    path: 'listar-caronas', 
    component: ListarCaronasComponent,
    data: { animation: 'ListarCaronasPage' }
  },
  
  // Rota 404
  {
    path: '**',
    redirectTo: '/boas-vindas'
  }
];