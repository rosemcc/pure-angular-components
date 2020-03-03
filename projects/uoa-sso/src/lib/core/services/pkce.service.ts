import { Injectable } from '@angular/core';
import { lib, SHA256, enc } from "crypto-js";
import { StorageService } from '.';

export interface ChallengePair {
  codeVerifier: string;
  codeChallenge: string;
}

@Injectable({
  providedIn: 'root'
})
export class PkceService {

  constructor(
    private storageService: StorageService
  ) {
  }

  public async getChallengePair() {

    let codeChallenge = await this.storageService.getItem('code');
    let codeVerifier = await this.storageService.getItem('codeVerifier');
    
    if (!codeChallenge) {
      codeVerifier = lib.WordArray.random(32).toString(enc.Base64)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      codeChallenge = SHA256(codeVerifier).toString(enc.Base64)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      this.storageService.setItem('code', codeChallenge);
      this.storageService.setItem('codeVerifier', codeVerifier);
    }

    return { codeVerifier, codeChallenge };
  }

}
