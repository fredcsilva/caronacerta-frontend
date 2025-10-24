# 🚗 Carona Certa - Frontend

Aplicação web para gerenciamento e compartilhamento de caronas em condomínios.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [Arquitetura](#arquitetura)
- [Build e Deploy](#build-e-deploy)

---

## 🎯 Sobre o Projeto

O **Carona Certa** é uma plataforma que conecta moradores de condomínios para compartilhamento de caronas, promovendo economia, sustentabilidade e convivência comunitária.

### Funcionalidades Principais

- ✅ Sistema de autenticação e autorização
- ✅ Cadastro complementar por etapas (wizard)
- ✅ Gerenciamento de caronas (CRUD)
- ✅ Áreas públicas e privadas bem definidas
- ✅ Interface responsiva e intuitiva

---

## 🛠️ Tecnologias

- **Angular 20** - Framework principal
- **TypeScript** - Linguagem de programação
- **Standalone Components** - Arquitetura moderna do Angular
- **Lazy Loading** - Carregamento sob demanda
- **RxJS** - Programação reativa
- **Guards** - Proteção de rotas

---

## 📁 Estrutura do Projeto
```
src/app/
├── core/                           # Módulo singleton - Serviços globais
│   ├── guards/                     # Guards de autenticação e autorização
│   │   └── cadastro-complementar.guard.ts
│   ├── models/                     # Interfaces e tipos globais
│   │   └── auth.types.ts
│   └── services/                   # Serviços compartilhados
│       ├── auth.service.ts
│       ├── encryption.service.ts
│       ├── haptic.service.ts
│       └── user.service.ts
│
├── shared/                         # Componentes reutilizáveis
│   ├── components/
│   │   ├── card-carona/           # Card de exibição de carona
│   │   ├── menu-bar/              # Barra de menu (público + privado)
│   │   └── tela-sucesso-page/     # Tela genérica de sucesso
│   └── ui/                        # Componentes UI genéricos
│
├── public/                         # Área Pública (sem autenticação)
│   ├── pages/
│   │   ├── boas-vindas-page/      # Landing page / Home
│   │   ├── auth-page-login/       # Login
│   │   ├── auth-page-novo-usuario/ # Cadastro
│   │   ├── auth-page-esqueci-senha/ # Recuperação de senha
│   │   └── auth-page-alterar-senha/ # Alteração de senha
│   └── public.routes.ts           # Rotas públicas
│
├── private/                        # Área Privada (requer autenticação)
│   ├── features/                   # Funcionalidades modulares
│   │   │
│   │   ├── cadastro-complementar/ # Feature: Wizard de cadastro
│   │   │   ├── components/
│   │   │   │   └── botao-wizard/  # Botão de navegação do wizard
│   │   │   ├── pages/
│   │   │   │   ├── cadastro-page-boas-vindas/
│   │   │   │   ├── cadastro-page-dados-pessoais/
│   │   │   │   ├── cadastro-page-condominio/
│   │   │   │   ├── cadastro-page-termos/
│   │   │   │   └── cadastro-page-sucesso/
│   │   │   ├── services/
│   │   │   │   └── cadastro-complementar.service.ts
│   │   │   └── cadastro-complementar.routes.ts
│   │   │
│   │   └── caronas/               # Feature: CRUD de Caronas
│   │       ├── components/         # Componentes reutilizáveis de carona
│   │       ├── models/             # Interfaces de carona
│   │       ├── pages/
│   │       │   └── carona-page-listar/ # Listagem de caronas
│   │       ├── services/           # Serviços de carona
│   │       └── caronas.routes.ts
│   │
│   ├── layout/                     # Componentes de layout privado
│   │   └── bottom-nav/            # Navegação inferior (mobile)
│   │
│   └── private.routes.ts          # Rotas privadas
│
├── assets/                         # Recursos estáticos
│   ├── fonts/                     # Fontes customizadas
│   └── images/                    # Imagens e ícones
│
├── environments/                   # Configurações de ambiente
│   └── environment.ts
│
├── app.component.ts               # Componente raiz
├── app.config.ts                  # Configuração da aplicação
└── app.routes.ts                  # Rotas principais
```

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Angular CLI 20+

### Passos
```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd carona-certa-frontend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
# Editar src/environments/environment.ts conforme necessário

# 4. Rodar aplicação
ng serve

# 5. Acessar no navegador
# http://localhost:4200
```

---

## 💻 Desenvolvimento

### Comandos Úteis
```bash
# Servidor de desenvolvimento
ng serve

# Servidor com porta customizada
ng serve --port 4300

# Build de desenvolvimento
ng build

# Build de produção
ng build --configuration production

# Rodar testes
ng test

# Gerar componente
ng generate component caminho/nome-componente --standalone

# Gerar serviço
ng generate service caminho/nome-service
```

### Padrões de Código

- **Nomenclatura de arquivos**: `nome-componente.component.ts`
- **Nomenclatura de classes**: `NomeComponenteComponent`
- **Standalone components**: Todos os componentes são standalone
- **Lazy loading**: Features carregadas sob demanda
- **TypeScript strict mode**: Habilitado

---

## 🗺️ Rotas da Aplicação

### Rotas Públicas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `BoasVindasPageComponent` | Landing page / Home |
| `/login` | `AuthPageLoginComponent` | Página de login |
| `/cadastro` | `AuthPageNovoUsuarioComponent` | Cadastro de novo usuário |
| `/esqueci-senha` | `AuthPageEsqueciSenhaComponent` | Recuperação de senha |
| `/alterar-senha` | `AuthPageAlterarSenhaComponent` | Alteração de senha |

### Rotas Privadas (requer autenticação)

| Rota | Componente | Guard | Descrição |
|------|-----------|-------|-----------|
| `/app/cadastro-complementar/boas-vindas` | `CadastroPageBoasVindasComponent` | `cadastroComplementarGuard` | Wizard - Passo 1 |
| `/app/cadastro-complementar/dados-pessoais` | `CadastroPageDadosPessoaisComponent` | `cadastroComplementarGuard` | Wizard - Passo 2 |
| `/app/cadastro-complementar/condominio` | `CadastroPageCondominioComponent` | `cadastroComplementarGuard` | Wizard - Passo 3 |
| `/app/cadastro-complementar/termos` | `CadastroPageTermosComponent` | `cadastroComplementarGuard` | Wizard - Passo 4 |
| `/app/cadastro-complementar/sucesso` | `CadastroPageSucessoComponent` | `cadastroComplementarGuard` | Wizard - Conclusão |
| `/app/caronas/listar` | `CaronaPageListarComponent` | - | Lista de caronas |
| `/app/caronas/nova` | `CaronaPageCriarComponent` | - | Criar nova carona |
| `/app/caronas/:id` | `CaronaPageDetalhesComponent` | - | Detalhes da carona |
| `/app/caronas/:id/editar` | `CaronaPageEditarComponent` | - | Editar carona |

---

## 🏗️ Arquitetura

### Separação de Responsabilidades

#### **Core Module**
- Serviços singleton (AuthService, UserService)
- Guards globais
- Modelos compartilhados
- **Regra**: Importado apenas uma vez no app

#### **Shared Module**
- Componentes reutilizáveis em múltiplas features
- Componentes de UI genéricos
- **Regra**: Sem lógica de negócio, apenas apresentação

#### **Public Area**
- Páginas acessíveis sem autenticação
- Landing page e fluxo de autenticação
- **Regra**: Sem guards de autenticação

#### **Private Area**
- Features organizadas por funcionalidade
- Cada feature é autocontida (pages, components, services, models)
- **Regra**: Protegida por guards de autenticação

### Guards

#### `authGuard`
- Protege toda a área privada (`/app/*`)
- Verifica se o usuário está autenticado
- Redireciona para `/login` se não autenticado

#### `cadastroComplementarGuard`
- Protege o wizard de cadastro complementar
- Verifica se o usuário precisa completar o cadastro
- Permite navegação apenas se cadastro incompleto

### Fluxo de Autenticação
```
1. Usuário acessa /app/*
   ↓
2. authGuard verifica autenticação
   ↓
3. Se não autenticado → redireciona para /login
   ↓
4. Se autenticado → permite acesso
   ↓
5. Se acessa /app/cadastro-complementar/*
   ↓
6. cadastroComplementarGuard verifica se cadastro está completo
   ↓
7. Se completo → redireciona para /app/caronas
   ↓
8. Se incompleto → permite acesso ao wizard
```

---

## 📦 Build e Deploy

### Build de Produção
```bash
# Build otimizado
ng build --configuration production

# Arquivos gerados em: dist/carona-certa-frontend/
```

### Configurações de Ambiente

Edite os arquivos em `src/environments/`:
```typescript
// environment.ts (desenvolvimento)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// environment.prod.ts (produção)
export const environment = {
  production: true,
  apiUrl: 'https://api.caronacerta.com.br'
};
```

### Deploy

O build gera arquivos estáticos que podem ser hospedados em:
- Vercel
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront
- Servidor web tradicional (Apache, Nginx)

---

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrão de Commits

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação de código
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas gerais

---

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

## 📞 Contato

Para dúvidas ou sugestões, entre em contato:

- Email: contato@caronacerta.com.br
- Website: https://caronacerta.com.br

---

**Desenvolvido com ❤️ pela equipe Carona Certa**
```

---

## 🎯 Observações Finais

Sua estrutura está **perfeita**! Apenas alguns pequenos ajustes que podem ser feitos posteriormente:

### ✅ O que está ótimo:
- Separação clara entre público e privado
- Core, shared e features bem organizados
- Guards isolados
- Rotas modulares com lazy loading

### 📝 Melhorias futuras (opcional):
1. **Padronizar nomes de arquivo do botao-wizard**:
```
   botao-wizard.ts → botao-wizard.component.ts
   botao-wizard.html → botao-wizard.component.html
   botao-wizard.css → botao-wizard.component.css
```

2. **Padronizar card-carona e menu-bar** (mesma coisa):
```
   card-carona.ts → card-carona.component.ts
   etc.