import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  SERVER_URL: string = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) { }

    /**
     * 
     * @param player 1 or 2
     * @param name player name input
     * @param score current score
     * @param position array of tiles selected
     */
    public savePlayer(player: string, name: string, score: number, position: []) {
      const obj = {
        player: player,
        name: name,
        score: score,
        position: position
      }
      return this.http.post(`${this.SERVER_URL}savePlayer`, obj);
    }
}
