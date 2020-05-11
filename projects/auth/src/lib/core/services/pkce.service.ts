import { Inject, Injectable } from '@angular/core';
import { lib, SHA256, enc } from 'crypto-js';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
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

  constructor(@Inject(LOCAL_STORAGE) private _storageService: StorageService) {}

  public clearChallengeFromStorage(): void {
    this._storageService.remove('codeVerifier');
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
    this._storageService.set('codeVerifier', codeVerifier);
    this.challengePair$.next({ codeChallenge, codeVerifier });
  }

  private async _challengeFromStorage(): Promise<ChallengePair> {
    const codeVerifier = this._storageService.get('codeVerifier');
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
