import { Injectable } from '@angular/core';
import * as crypto from "crypto";

export interface ChallengePair {
  codeVerifier: string;
  codeChallenge: string;
}

@Injectable({
  providedIn: 'root'
})
export class PkceService {

  public generateChallengePair(): ChallengePair {
    const codeVerifier = this.base64URLEncode(crypto.randomBytes(32));
    const codeChallenge = this.base64URLEncode(this.sha256(codeVerifier));
    return { codeVerifier, codeChallenge };
  }

  private base64URLEncode(str) {
    return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
  }

}
