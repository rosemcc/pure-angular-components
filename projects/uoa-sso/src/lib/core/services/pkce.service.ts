import { Injectable } from '@angular/core';
import { lib, SHA256, enc } from "crypto-js";

export interface ChallengePair {
  codeVerifier: string;
  codeChallenge: string;
}

@Injectable({
  providedIn: 'root'
})
export class PkceService {

  public generateChallengePair(): ChallengePair {
    const codeVerifier = lib.WordArray.random(32).toString(enc.Base64);
    const codeChallenge = SHA256(codeVerifier).toString(enc.Base64);
    return { codeVerifier, codeChallenge };
  }

}
