# 🚗 Carona Certa

> Sistema de caronas colaborativas para condomínios residenciais

[![Angular](https://img.shields.io/badge/Angular-20-red)](https://angular.io/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-20.2.0-blue)](https://primeng.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Sobre o Projeto

**Carona Certa** é uma aplicação web/mobile que conecta moradores de condomínios residenciais para oferecer e solicitar caronas. O sistema beneficia todos os envolvidos:

- 💰 **Passageiros**: Economizam com transporte
- 💵 **Motoristas**: Geram renda extra
- 🏢 **Condomínio**: Recebe parte do valor para melhorias aprovadas pelos moradores

---

## ✨ Funcionalidades

### 🔐 Autenticação
- [x] Login com email e senha
- [x] Registro de novos usuários
- [x] Recuperação de senha
- [x] Verificação de email
- [x] "Lembrar-me" com senha criptografada (AES-256)
- [x] Logout seguro

### 👤 Cadastro Complementar (Fluxo Progressivo)
- [x] Boas-vindas
- [x] Dados pessoais (data de nascimento, telefone, gênero)
- [x] Dados do condomínio (país, estado, nome, bloco, apartamento)
- [x] Aceite de termos e políticas
- [x] Confirmação de sucesso
- [x] Sistema de guards para controle de acesso

### 🚙 Sistema de Caronas (Em Desenvolvimento)
- [ ] Listagem de caronas disponíveis
- [ ] Oferecer carona
- [ ] Solicitar carona
- [ ] Sistema de pagamento (Pix)
- [ ] Avaliações e feedback
- [ ] Histórico de caronas

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework**: Angular 20
- **UI Library**: PrimeNG 20.2.0
- **Tema**: @primeng/themes (Aura preset)
- **Tipografia**: 
  - Títulos: Nunito (Regular 400, Bold 700)
  - Corpo: Open Sans (Regular 400, SemiBold 600)
- **Animações**: HammerJS para gestos touch
- **Criptografia**: CryptoJS (AES-256)
- **Estilo**: Mobile-first, responsivo, aparência de app nativo

### Backend (Planejado)
- **Linguagem**: Java 21
- **Framework**: Spring Boot
- **Banco de Dados**: Firebase Firestore
- **Autenticação**: Firebase Authentication
- **Pagamentos**: Integração Pix
- **Mapa**: Google Maps API

### Servidor de Email
- **Runtime**: Node.js (porta 3000)
- **Biblioteca**: Resend
- **Rotas disponíveis**:
  - `/email/boas-vindas`
  - `/email/recuperar-senha`
  - `/email/notificacao`
  - `/email/com-anexo`

---

## 🎨 Design System

### Paleta de Cores
```css
--primary-color: #7E57C2;      /* Roxo médio - identidade principal */
--secondary-color: #81C784;    /* Verde menta - ações positivas */
--background-color: #F1F8E9;   /* Bege claro */
--text-color: #424242;         /* Cinza escuro */
--text-on-primary: #FFFFFF;    /* Branco */
```

### Componentes
- Menu-bar fixo com título centralizado
- Feedback tátil (vibração em dispositivos compatíveis)
- Efeito ripple nos botões
- Animações suaves de transição
- Layout 70-30 (conteúdo/ações)

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- npm ou yarn
- Angular CLI 20+

```bash
npm install -g @angular/cli@20
```

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/carona-certa-frontend.git
cd carona-certa-frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081/api'
};
```

Para produção, crie `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.caronacerta.com.br/api'
};
```

4. **Execute o servidor de desenvolvimento**
```bash
ng serve
```

5. **Acesse no navegador**
```
http://localhost:4200
```

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── boas-vindas/                    # Tela inicial
│   │   ├── login/                          # Autenticação
│   │   ├── novo-usuario/                   # Registro
│   │   ├── esqueci-senha/                  # Recuperação de senha
│   │   ├── alterar-senha/                  # Alteração de senha
│   │   ├── cadastro-complementar-boas-vindas/
│   │   ├── cadastro-complementar-dados-pessoais/
│   │   ├── cadastro-complementar-condominio/
│   │   ├── cadastro-complementar-termos/
│   │   ├── cadastro-complementar-sucesso/
│   │   ├── listar-caronas/                 # Dashboard principal
│   │   └── menu-bar/                       # Componente de navegação
│   │
│   ├── services/
│   │   ├── auth.services.ts                # Serviços de autenticação
│   │   ├── user.service.ts                 # Gerenciamento de usuário
│   │   ├── cadastro-complementar-service.ts
│   │   ├── encryption.service.ts           # Criptografia AES-256
│   │   └── haptic.service.ts               # Feedback tátil
│   │
│   ├── guards/
│   │   └── cadastro-complementar.guard.ts  # Proteção de rotas
│   │
│   ├── app.routes.ts                       # Configuração de rotas
│   └── app.config.ts                       # Configuração global
│
├── assets/
│   ├── fonts/                              # Nunito e Open Sans
│   └── images/                             # Imagens do carousel
│
└── environments/
    ├── environment.ts                      # Config desenvolvimento
    └── environment.prod.ts                 # Config produção
```

---

## 🔒 Segurança

### Autenticação
- ✅ JWT Tokens com expiração
- ✅ Verificação de email obrigatória
- ✅ Refresh tokens automáticos
- ✅ Logout seguro (invalida tokens no backend)

### Armazenamento de Credenciais
- ✅ Senhas criptografadas com **AES-256**
- ✅ Chave baseada no dispositivo (binding)
- ✅ Tokens em localStorage (permanente) ou sessionStorage (temporário)
- ✅ Limpeza automática de tokens inválidos

### Guards de Rota
- ✅ Proteção do fluxo de cadastro complementar
- ✅ Verificação de posição do usuário
- ✅ Redirecionamento automático

---

## 🧪 Testes

```bash
# Testes unitários
ng test

# Testes e2e
ng e2e

# Coverage
ng test --code-coverage
```

---

## 📦 Build para Produção

```bash
# Build otimizado
ng build --configuration production

# Arquivos gerados em: dist/carona-certa-frontend/
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

### Versão 1.0 (MVP)
- [x] Sistema de autenticação completo
- [x] Cadastro complementar progressivo
- [x] Sistema de "Lembrar-me"
- [ ] Listagem de caronas
- [ ] Oferecer/solicitar carona
- [ ] Integração com backend Java/Spring Boot

### Versão 2.0
- [ ] Sistema de pagamento (Pix)
- [ ] Avaliações e feedback
- [ ] Chat entre motorista e passageiro
- [ ] Notificações push
- [ ] Integração Google Maps
- [ ] App mobile (Ionic/Capacitor)

### Versão 3.0
- [ ] Sistema de projetos do condomínio
- [ ] Votação de melhorias
- [ ] Dashboard financeiro
- [ ] Relatórios e estatísticas

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

- **Fred de Carvalho Silva** - *Desenvolvedor Principal* - [GitHub](https://github.com/fredcsilva)

---

## 📞 Contato

- **Email**: fredcsilva@gmail.com
- **LinkedIn**: [Fred Carvalho](https://linkedin.com/in/fredcsilva)

---

## 🙏 Agradecimentos

- [Angular](https://angular.io/)
- [PrimeNG](https://primeng.org/)
- [Firebase](https://firebase.google.com/)
- [CryptoJS](https://cryptojs.gitbook.io/)
- Comunidade open source

---

<p align="center">Feito com ❤️ para facilitar a mobilidade em condomínios</p>
