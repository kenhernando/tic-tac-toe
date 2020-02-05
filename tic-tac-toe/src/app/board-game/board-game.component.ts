import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { ConfigService } from '../config.service';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-board-game',
  templateUrl: './board-game.component.html',
  styleUrls: ['./board-game.component.scss'],
})
export class BoardGameComponent implements OnInit {

  constructor(private localStorageService: LocalStorageService,
    private configService: ConfigService,
    private playerService: PlayerService,
    private dialog: MatDialog,
    private router: Router) { }

  private playerBtnList: any[] = [{ 'key': '1', 'label': 'X' },
  { 'key': '2', 'label': 'O' }];

  public currentPlayerName: string = '';
  public currentPlayer: string = '1';
  public firstPlayerName: string = '';
  public secondPlayerName: string = '';
  public firstPlayerScore: number = 0;
  public secondPlayerScore: number = 0;
  public btnProps: any[] = [];
  public isLoaded: boolean = false;

  private defaultBtnProps: any = [];
  private firstPlayerPositions: string[] = [];
  private secondPlayerPositions: string[] = [];

  ngOnInit() {
    console.log('hey');
    this.configService.getBtnConfig().pipe(concatMap((data: any) => {
      this.isLoaded = true;
      this.defaultBtnProps = data;
      const cachedData = this.localStorageService.getListItem('cachedData');
      if (cachedData.length > 1) {
        this.btnProps = cachedData.map(a => ({ ...a }));
      } else {
        this.initBoard();
      }
      return of('next');
    })).subscribe();

    const cachedCurrentPlayer = this.localStorageService.getItem('currentPlayer');
    const cachedFirstPlayerName = this.localStorageService.getItem('firstPlayerName');
    const cachedSecondPlayerName = this.localStorageService.getItem('secondPlayerName');
    const cachedFirstPlayerScore = this.localStorageService.getItem('firstPlayerScore');
    const cachedSecondPlayerScore = this.localStorageService.getItem('secondPlayerScore');

    this.currentPlayer = this.isValidCacheData(cachedCurrentPlayer) ? cachedCurrentPlayer : '1';
    this.firstPlayerName = this.isValidCacheData(cachedFirstPlayerName) ? cachedFirstPlayerName : 'PlayerX';
    this.secondPlayerName = this.isValidCacheData(cachedSecondPlayerName) ? cachedSecondPlayerName : 'PlayerO';
    this.firstPlayerScore = this.isValidCacheData(cachedFirstPlayerScore) ? parseInt(cachedFirstPlayerScore) : 0;
    this.secondPlayerScore = this.isValidCacheData(cachedSecondPlayerScore) ? parseInt(cachedSecondPlayerScore) : 0;
  }

  /** checks for the validity of cached data from local storage (ie: not null, not undefined) 
   * @param data data that was cached in local storage
  */
  private isValidCacheData(data) {
    return typeof data !== 'undefined' && data !== 'undefined' && data !== 'null' && data !== null;
  }

  /** This function will be triggered when a tile clicked or number keys.
   * Tile button style and label will be changed and for each selection, 
   * determine whether a player won.
   * @param selectedBtn serves as the identifier for the button selected
  */
  public onTileSelect(selectedBtn: string) {
    const playerBtnStyle = this.playerBtnList.find(el => el['key'] === this.currentPlayer);
    this.btnProps[selectedBtn].label = playerBtnStyle.label;
    this.btnProps[selectedBtn].disabled = true;
    this.btnProps[selectedBtn].tempData = (this.currentPlayer === '1') ? -1 : 1;
    if (this.currentPlayer === '1') {
      this.firstPlayerPositions.push(selectedBtn);
      this.currentPlayer = '2';
    } else {
      this.secondPlayerPositions.push(selectedBtn);
      this.currentPlayer = '1';
    }
    this.determineWinner();
  }

  /** This function will determine which player won the game using tempData property on each button. 
   * A sum of -3 means that the first player (Player X) has won.
   * A sum of 3 means that the second player (Player O) has won.
   */
  private determineWinner() {
    const winScenarios = [
      this.btnProps[6].tempData + this.btnProps[3].tempData + this.btnProps[0].tempData,
      this.btnProps[7].tempData + this.btnProps[4].tempData + this.btnProps[1].tempData,
      this.btnProps[8].tempData + this.btnProps[5].tempData + this.btnProps[2].tempData,
      this.btnProps[6].tempData + this.btnProps[7].tempData + this.btnProps[8].tempData,
      this.btnProps[3].tempData + this.btnProps[4].tempData + this.btnProps[5].tempData,
      this.btnProps[0].tempData + this.btnProps[1].tempData + this.btnProps[2].tempData,
      this.btnProps[6].tempData + this.btnProps[4].tempData + this.btnProps[2].tempData,
      this.btnProps[0].tempData + this.btnProps[4].tempData + this.btnProps[8].tempData];

    if (winScenarios.includes(-3)) {
      this.firstPlayerScore++;
      this.openWinnerDialog('X', this.firstPlayerName);
    } else if (winScenarios.includes(3)) {
      this.secondPlayerScore++;
      this.openWinnerDialog('O', this.secondPlayerName);
    }
  }

  /** This will initialize the tic-tac-toe board when a player has won. */
  public initBoard() {
    this.btnProps = this.defaultBtnProps.map(a => ({ ...a }));
    this.currentPlayer = '1';
  }

  /** This will open the dialog and display congratulatory message for the winner. */
  private openWinnerDialog(type, name): void {
    let dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '250px',
      data: { type: type, name: name }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.initBoard();
    });
  }

  /** Resets player score, names and current player positions from local storage. */
  public resetGame() {
    this.localStorageService.clear();
    this.router.navigate(['player-names']);
  }

  /** listen for browser close event */
  @HostListener('window:beforeunload')
  saveData() {
    this.localStorageService.setItem('firstPlayerName', this.firstPlayerName, true);
    this.localStorageService.setItem('secondPlayerName', this.secondPlayerName, true);
    this.localStorageService.setItem('firstPlayerScore', this.firstPlayerScore, false);
    this.localStorageService.setItem('secondPlayerScore', this.secondPlayerScore, false);
    this.localStorageService.setItem('cachedData', this.btnProps, false);

    this.playerService.savePlayer('1', this.firstPlayerName, this.firstPlayerScore, this.firstPlayerPositions).subscribe();
    this.playerService.savePlayer('2', this.secondPlayerName, this.secondPlayerScore, this.secondPlayerPositions).subscribe();
  }

  /**listen for numpad 1-9 keypress */
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const regex = /[1-9]/g;
    const index = parseInt(event.key) - 1;
    if (regex.test(event.key) && !this.btnProps[index].disabled) {
      this.onTileSelect(index.toString());
    }
  }

}
