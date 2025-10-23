import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CadastroComplementarService } from '../../services/cadastro-complementar-service';

/**
 * Guard que protege as rotas do cadastro complementar
 * Garante que o usuário só pode acessar a tela correspondente à sua posição atual
 */
export const cadastroComplementarGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const cadastroService = inject(CadastroComplementarService);

  // 1️⃣ Verifica se está autenticado
  const token = userService.getToken();
  if (!token) {
    console.warn('⚠️ Usuário não autenticado. Redirecionando para login...');
    router.navigate(['/login']);
    return false;
  }

  // 2️⃣ Obtém usuário atual (prioriza cache do login)
  let user = userService.getCurrentUser();
  
  // Se não tiver no cache, busca do backend
  if (!user) {
    const userId = userService.getUserId();
    if (!userId) {
      console.warn('⚠️ UserId não encontrado');
      router.navigate(['/login']);
      return false;
    }
    
    try {
      console.log('🔍 Buscando usuário do backend...');
      user = await userService.fetchUserData(userId, token);
      console.log('📦 Usuário obtido do backend:', user);
    } catch (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error);
      router.navigate(['/login']);
      return false;
    }
  } else {
    console.log('✅ Usuário obtido do cache:', user);
  }

  // 3️⃣ Verifica se o cadastro está completo (posição 6)
  const posicaoAtual = user.posicaoCadastroComplementar || 1;
  
  if (posicaoAtual >= 6) {
    console.log('✅ Cadastro completo (posição 6 ou maior). Redirecionando para listar caronas...');
    router.navigate(['/listar-caronas']);
    return false;
  }

  // 4️⃣ Obtém a rota esperada para a posição atual
  const rotaAtual = '/' + route.routeConfig?.path;
  const rotaEsperada = cadastroService.obterRotaPorPosicao(posicaoAtual);

  console.log(`🔍 Posição atual: ${posicaoAtual} | Rota esperada: ${rotaEsperada} | Rota acessada: ${rotaAtual}`);

  // 5️⃣ Se a rota não corresponde à posição, redireciona
  if (rotaAtual !== rotaEsperada) {
    console.warn(`⚠️ Acesso negado! Redirecionando para: ${rotaEsperada}`);
    router.navigate([rotaEsperada]);
    return false;
  }

  // 6️⃣ Rota válida, permite acesso
  console.log('✅ Acesso permitido à tela:', rotaAtual);
  return true;
};