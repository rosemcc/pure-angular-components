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
  public challengePair$: BehaviorSubject<ChallengePair> = new BehaviorSubject(null);

  constructor(private storageService: StorageService) {}

  public clearChallengeFromStorage(): void {
    this.storageService.removeItem('codeVerifier');
  }

  public loadOrGeneratePair(): void {
    this.challengeFromStorage().then(challenge => {
      const challengePair = this.challengePair$.getValue();
      if (!challengePair) {
        if (challenge) {
          this.challengePair$.next(challenge);
        } else {
          const codeVerifier = this.stripSymbols(lib.WordArray.random(32).toString(enc.Base64));
          const codeChallenge = this.stripSymbols(SHA256(codeVerifier).toString(enc.Base64));
          this.storageService.setItem('codeVerifier', codeVerifier);
          this.challengePair$.next({ codeChallenge, codeVerifier });
        }
      }
    });
  }

  private async challengeFromStorage() {
    const codeVerifier = await this.storageService.getItem('codeVerifier');
    if (!codeVerifier) return null;
    return { codeChallenge: null, codeVerifier };
  }

  private stripSymbols(str: string): string {
    return str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}
