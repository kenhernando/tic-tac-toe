import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public getItem(key) {
    return localStorage.getItem(key);
  }

  public clear() {
    return localStorage.clear();
  }

  /**save to local storage where value is of type: number or list of objects */
  public setItem(key, value, isString) {
    value = isString ? value : JSON.stringify(value);
    localStorage.setItem(key, value);
  }

  public getListItem(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
}
