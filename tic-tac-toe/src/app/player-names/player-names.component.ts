import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-player-names',
  templateUrl: './player-names.component.html',
  styleUrls: ['./player-names.component.scss']
})
export class PlayerNamesComponent implements OnInit {

  constructor(private router: Router) { }

  public firstPlayerName: string;
  public secondPlayerName: string;

  ngOnInit() {
  }

  public submitNames() {
    /**validate Names before submit */
    localStorage.setItem('firstPlayerName', this.firstPlayerName);
    localStorage.setItem('secondPlayerName', this.secondPlayerName);
    localStorage.setItem('currentPlayer', '1');
    this.router.navigate(['board-game']);
  }

}
