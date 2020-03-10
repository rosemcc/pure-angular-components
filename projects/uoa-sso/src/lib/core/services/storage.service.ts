import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage)
  {}

  getItem(key: string): Promise<any> {
    return this.storage.get(key);
  }

  setItem(key: string, val: any): void {
    this.storage.set(key, val);
  }
  
  removeItem(key: string): void {
    this.storage.remove(key);
  }

}