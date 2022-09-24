import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key: string, value: any): void {
    localStorage.setItem(key, String(value));
}

  get(key: string): string | null {
      return localStorage.getItem(key);
  }

  remove(key: string): void {
      localStorage.removeItem(key);
  }

  clear(): void {
      // localStorage.clear();
      if (this.get('openBuyModal')) {
          this.remove('openBuyModal');
      }
      if (this.get('token')) {
          this.remove('token');
      }
  }
}
