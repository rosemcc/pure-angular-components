import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {}

  public getItem(key: string): Promise<any> {
    return this.storage.get(key);
  }

  public setItem(key: string, val: any): void {
    this.storage.set(key, val);
  }

  public removeItem(key: string): void {
    this.storage.remove(key);
  }
}
