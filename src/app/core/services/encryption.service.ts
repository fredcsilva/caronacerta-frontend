import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  
  // 🔑 Chave secreta para criptografia
  private readonly secretKey = 'CaronaCerta@2024#SecureKey!';

  constructor() {}

  /**
   * Criptografa um texto usando AES + chave do dispositivo
   * @param text - Texto a ser criptografado
   * @returns Texto criptografado
   */
  encrypt(text: string): string {
    try {
      const deviceKey = this.getDeviceKey();
      const combinedKey = this.secretKey + deviceKey;
      const encrypted = CryptoJS.AES.encrypt(text, combinedKey).toString();
      return encrypted;
    } catch (error) {
      console.error('❌ Erro ao criptografar:', error);
      return '';
    }
  }

  /**
   * Descriptografa um texto criptografado
   * @param encryptedText - Texto criptografado
   * @returns Texto original descriptografado
   */
  decrypt(encryptedText: string): string {
    try {
      const deviceKey = this.getDeviceKey();
      const combinedKey = this.secretKey + deviceKey;
      const decrypted = CryptoJS.AES.decrypt(encryptedText, combinedKey);
      const originalText = decrypted.toString(CryptoJS.enc.Utf8);
      return originalText;
    } catch (error) {
      console.error('❌ Erro ao descriptografar:', error);
      return '';
    }
  }

  /**
   * Gera uma chave única baseada no navegador/dispositivo
   * @returns Chave única do dispositivo
   */
  private getDeviceKey(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    
    const deviceString = `${userAgent}-${platform}-${language}`;
    return CryptoJS.SHA256(deviceString).toString();
  }
}