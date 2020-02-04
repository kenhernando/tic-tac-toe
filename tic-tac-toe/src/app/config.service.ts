import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  SERVER_URL: string = 'http://localhost:8080/api/';

  constructor(private httpClient: HttpClient) { }

  public getBtnConfig() {
    return this.httpClient.get(`${this.SERVER_URL}config`);
  }
}
