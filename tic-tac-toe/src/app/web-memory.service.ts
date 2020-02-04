import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebMemoryService {

  public firstPlayerScore: number;
  public secondPlayerScore: number;
  
  constructor() { }
}
