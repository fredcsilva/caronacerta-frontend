import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HapticService {
  lightTap() {
    if ('vibrate' in navigator) navigator.vibrate(30);
  }

  mediumTap() {
    if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);
  }

  heavyTap() {
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
  }

  // 🆕 Novo método para erros
  errorTap() {
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
  }
}
