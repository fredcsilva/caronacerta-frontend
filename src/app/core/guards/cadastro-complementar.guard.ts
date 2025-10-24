// src/app/core/guards/cadastro-complementar.guard.ts

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from './../services/user.service';

export const cadastroComplementarGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const userService = inject(UserService);

  console.log('🛡️ GUARD: Validando acesso ao cadastro complementar');

  // 1️⃣ Verifica autenticação
  const token = userService.getToken();
  if (!token) {
    console.warn('⚠️ GUARD: Não autenticado');
    router.navigate(['/login']);
    return false;
  }

  // 2️⃣ Obtém usuário
  let user = userService.getCurrentUser();
  
  if (!user) {
    const userId = userService.getUserId();
    if (!userId) {
      console.warn('⚠️ GUARD: UserId não encontrado');
      router.navigate(['/login']);
      return false;
    }
    
    try {
      console.log('🔍 GUARD: Buscando usuário do backend...');
      user = await userService.fetchUserData(userId, token);
    } catch (error) {
      console.error('❌ GUARD: Erro ao buscar usuário:', error);
      router.navigate(['/login']);
      return false;
    }
  }

  const posicaoAtual = user.posicaoCadastroComplementar || 1;
  console.log('📍 GUARD: Posição do usuário:', posicaoAtual);

  // 3️⃣ Se cadastro completo (posição >= 6), NÃO pode acessar wizard
  if (posicaoAtual >= 6) {
    console.log('❌ GUARD: Cadastro completo - acesso negado ao wizard');
    router.navigate(['/app/caronas/listar']);
    return false;
  }

  // 4️⃣ Se cadastro incompleto, PODE acessar wizard
  console.log('✅ GUARD: Cadastro incompleto - acesso permitido');
  return true;
};