import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  static list(): any {
    return { ...localStorage };
  }

  static get(key: string): any {
    const value = localStorage.getItem(key);
    if (!value) { return; }
    try {
      const data = JSON.parse(value);
      return data;
    } catch (e) {
      console.error(e);
      return value;
    }
  }

  static save(key: string, value: any): void {
    if (!value) { return; }
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(key, data);
    } catch (e) {
      console.error(e);
      localStorage.setItem(key, value);
    }
  }

  static remove(key: string) {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  }

  static clear() {
    localStorage.clear();
  }
}
