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

  private playerBtnList = [{ 'key': "1", 'val': { label: "X" } },
  { 'key': "2", 'val': { label: "O" } }];

  public currentPlayerName: string = '';
  public currentPlayer: string = '1';
  public firstPlayerName = '';
  public secondPlayerName = '';
  public firstPlayerScore = 0;
  public secondPlayerScore = 0;

  private defaultBtnProps = [];
  public btnProps = [];
  public isLoaded = false;

  ngOnInit() {
    this.configService.getBtnConfig().pipe(concatMap((data: any) => {
      this.isLoaded = true;
      const cachedData = this.localStorageService.getListItem('cachedData');
      if (cachedData.length > 1) {
        this.btnProps = cachedData;
      } else {
        this.defaultBtnProps = data;
        this.initBoard();
      }
      return of(null);
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

  private isValidCacheData(data) {
    return typeof data !== 'undefined' && data !== 'undefined' && data !== 'null' && data !== null;
  }

  public onTileSelect(selectedBtn: string) {
    const playerBtnStyle = this.playerBtnList.find(el => el['key'] === this.currentPlayer);
    this.btnProps[selectedBtn].label = playerBtnStyle['val'].label;
    this.btnProps[selectedBtn].disabled = true;
    this.btnProps[selectedBtn].tempData = (this.currentPlayer === '1') ? -1 : 1;
    this.currentPlayer = (this.currentPlayer === '1') ? '2' : '1';
    this.determineWinner();
  }

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

  public initBoard() {
    this.btnProps = this.defaultBtnProps.map(a => ({ ...a }));
    this.currentPlayer = '1';
  }

  private openWinnerDialog(type, name): void {
    let dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '250px',
      data: { type: type, name: name }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.initBoard();
    });
  }

  public resetGame() {
    this.localStorageService.clear();
    this.router.navigate(['player-names']);
  }

  /**listen for browser close event */
  @HostListener('window:beforeunload')
  saveData() {
    this.localStorageService.setItem('firstPlayerName', this.firstPlayerName, true);
    this.localStorageService.setItem('secondPlayerName', this.secondPlayerName, true);
    this.localStorageService.setItem('firstPlayerScore', this.firstPlayerScore, false);
    this.localStorageService.setItem('secondPlayerScore', this.secondPlayerScore, false);
    this.localStorageService.setItem('cachedData', this.btnProps, false);


    /**TODO: extract player positions and replace empty array */
    this.playerService.savePlayer('1', this.firstPlayerName, this.firstPlayerScore, []).subscribe();
    this.playerService.savePlayer('2', this.secondPlayerName, this.secondPlayerScore, []).subscribe();
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
