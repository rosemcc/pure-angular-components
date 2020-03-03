import { Injectable } from '@angular/core';
import { lib, SHA256, enc } from "crypto-js";
import { StorageService } from '.';
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
  
  constructor(
    private storageService: StorageService
  ) {
  }

  public getChallengePair(): BehaviorSubject<ChallengePair> {

    const existingChallenge = this.challengePair$.getValue();
    if (existingChallenge === null) {

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

    return this.challengePair$;
  }

  private async challengeFromStorage() {
    let codeChallenge = await this.storageService.getItem('code');
    if (!codeChallenge) return null;
    let codeVerifier = await this.storageService.getItem('codeVerifier');
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
