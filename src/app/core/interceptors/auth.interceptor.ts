import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor HTTP que captura erros de autenticação (401)
 * e redireciona o usuário para a página de login com mensagem de sessão expirada
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Captura erro 401 (Unauthorized) - Token expirado ou inválido
      if (error.status === 401) {
        console.warn('⚠️ Token expirado ou inválido. Redirecionando para login...');
        
        // Limpa dados de autenticação do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currentUser');
        
        // Limpa dados de autenticação do sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('currentUser');
        
        // Redireciona para login com parâmetro de sessão expirada
        router.navigate(['/login'], {
          queryParams: { sessionExpired: 'true' }
        });
      }
      
      // Retorna o erro para ser tratado por quem fez a requisição
      return throwError(() => error);
    })
  );
};