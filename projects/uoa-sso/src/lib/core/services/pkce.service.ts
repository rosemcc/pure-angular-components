import { Injectable } from '@angular/core';
import { lib, SHA256, enc } from 'crypto-js';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';

export interface ChallengePair {
  codeVerifier: string;
  codeChallenge: string;
}

@Injectable({
  providedIn: 'root'
})
export class PkceService {
  private challengePair$: BehaviorSubject<ChallengePair> = new BehaviorSubject(null);

  constructor(private storageService: StorageService) {
    this.loadOrGeneratePair();
  }

  public getChallengePair(): BehaviorSubject<ChallengePair> {
    const existingChallenge = this.challengePair$.getValue();
    if (existingChallenge === null) {
      this.loadOrGeneratePair();
    }
    return this.challengePair$;
  }

  public clearChallengeFromStorage() {
    this.storageService.removeItem('code');
    this.storageService.removeItem('codeVerifier');
  }

  private loadOrGeneratePair() {
    this.challengeFromStorage().then(challenge => {
      if (challenge) {
        this.challengePair$.next(challenge);
      } else {
        const codeVerifier = this.stripSymbols(lib.WordArray.random(32).toString(enc.Base64));
        const codeChallenge = this.stripSymbols(SHA256(codeVerifier).toString(enc.Base64));
        
        this.storageService.setItem('code', codeChallenge);
        this.storageService.setItem('codeVerifier', codeVerifier);
        this.challengePair$.next({ codeChallenge, codeVerifier });
      }
    });
  }

  private async challengeFromStorage() {
    const codeChallenge = await this.storageService.getItem('code');
    if (!codeChallenge) return null;
    const codeVerifier = await this.storageService.getItem('codeVerifier');
    if (!codeVerifier) return null;
    return { codeChallenge, codeVerifier };
  }

  private stripSymbols(str: string): string {
    return str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}
