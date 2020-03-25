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

  public loadChallengePair(): void {
    this._challengeFromStorage().then(challenge => {
      const challengePair = this.challengePair$.getValue();
      if (!challengePair && challenge) {
        this.challengePair$.next(challenge);
      } else {
        this.generateChallengePair();
      }
    });
  }

  public generateChallengePair(): void {
    const codeVerifier = this._stripSymbols(lib.WordArray.random(32).toString(enc.Base64));
    const codeChallenge = this._stripSymbols(SHA256(codeVerifier).toString(enc.Base64));
    this.storageService.setItem('codeVerifier', codeVerifier);
    this.challengePair$.next({ codeChallenge, codeVerifier });
  }

  private async _challengeFromStorage(): Promise<ChallengePair> {
    const codeVerifier = await this.storageService.getItem('codeVerifier');
    if (!codeVerifier) return null;
    return { codeChallenge: null, codeVerifier };
  }

  private _stripSymbols(str: string): string {
    return str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}
