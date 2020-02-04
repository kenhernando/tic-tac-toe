import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tic-tac-toe';

  constructor(private router: Router, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    
  /**
   * if cache/saved-game is available, route to pre-filled tic-tac-toe tiles, otherwise route to player-names page.
   */
    const cachedData = this.localStorageService.getItem('cachedData');
    if (cachedData !== 'undefined' && typeof cachedData !== 'undefined' && cachedData != null && cachedData.length > 1) {
      this.router.navigate(['board-game']);
    } else {
      this.router.navigate(['player-names']);
    }
  }
}
