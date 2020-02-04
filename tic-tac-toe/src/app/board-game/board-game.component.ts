import { Component, OnInit, HostListener } from '@angular/core';
import { WebMemoryService } from '../web-memory.service';
import { MatDialog } from '@angular/material/dialog';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-board-game',
  templateUrl: './board-game.component.html',
  styleUrls: ['./board-game.component.scss'],
})
export class BoardGameComponent implements OnInit {

  constructor(private webMemoryService: WebMemoryService,
    private localStorageService:LocalStorageService,
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

  private btnDefaultConfig = [{
    color: 'primary',
    label: '?',
    disabled: false,
    tempData: 0
  }, {
    color: 'primary',
    label: '?',
    disabled: false,
    tempData: 0
  }, {
    color: 'primary',
    label: '?',
    disabled: false,
    tempData: 0
  }, {
    color: 'primary',
    label: '?',
    disabled: false,
    tempData: 0
  }, {
    color: 'primary',
    label: '?',
    disabled: false,
    tempData: 0
  }, {
    color: 'primary',
    label: '?',
    disabled: false,
    tempData: 0
  }, {
    color: 'primary',
    label: '?',
    disabled: false,
    tempData: 0
  }, {
    color: 'primary',
    label: '?',
    disabled: false,
    tempData: 0
  }, {
    color: 'primary',
    label: '?',
    disabled: false,
    tempData: 0
  }];

  public btnProps = [];

  ngOnInit() {
    this.initBoard();
    const cachedCurrentPlayer = this.localStorageService.getItem('currentPlayer');
    const cachedFirstPlayerName = this.localStorageService.getItem('firstPlayerName');
    const cachedSecondPlayerName = this.localStorageService.getItem('secondPlayerName');
    this.currentPlayer = this.initCachedData(cachedCurrentPlayer, '1');
    this.firstPlayerName = this.initCachedData(cachedFirstPlayerName, 'PlayerX');
    this.secondPlayerName = this.initCachedData(cachedSecondPlayerName, 'PlayerO');
    const cachedData = this.localStorageService.getListItem('cachedData');
    if (cachedData.length > 1) {
      this.btnProps = cachedData;
    } else {
      this.initBoard();
    }
  }

  private initCachedData(cachedData, defaultResult) {
    console.log(typeof cachedData);
    return (typeof cachedData !== 'undefined') ? cachedData : defaultResult;
  }


  public selectButton(selectedBtn: string) {
    const playerBtnStyle = this.playerBtnList.find(el => el['key'] === this.currentPlayer);
    this.btnProps[selectedBtn].label = playerBtnStyle['val'].label;
    this.btnProps[selectedBtn].disabled = true;
    this.btnProps[selectedBtn].tempData = (this.currentPlayer === '1') ? -1 : 1;
    this.togglePlayer();
    this.computeWin();
  }

  private togglePlayer() {
    this.currentPlayer = (this.currentPlayer === '1') ? '2' : '1';
  }

  private computeWin() {
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
      this.initBoard();
      this.openDialog('X', this.firstPlayerName);
    } else if (winScenarios.includes(3)) {
      this.secondPlayerScore++;
      this.initBoard();
      this.openDialog('O', this.secondPlayerName);
    }
  }

  public initBoard() {
    this.btnProps = this.btnDefaultConfig.map(a => ({ ...a }));
    this.currentPlayer = '1';
  }

  openDialog(type, name): void {
   this.dialog.open(ResultDialogComponent, {
      width: '250px',
      data: {type: type, name: name}
    });
  }

  public resetGame() {
    this.localStorageService.clear();
    this.router.navigate(['player-names']);
  }

  /**listen for browser close event */
  @HostListener('window:beforeunload')
  saveData() {
    this.localStorageService.setItem('firstPlayerName', this.firstPlayerName);
    this.localStorageService.setItem('secondPlayerName', this.secondPlayerName);
    this.localStorageService.setItem('firstPlayerScore', this.webMemoryService.firstPlayerScore);
    this.localStorageService.setItem('secondPlayerScore', this.webMemoryService.secondPlayerScore);
    this.localStorageService.setItem('cachedData', this.btnProps)
  }

  /**listen for numpad 1-9 keypress */
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    const regex = /[1-9]/g;
    const index = parseInt(event.key)-1;
    if (regex.test(event.key) && !this.btnProps[index].disabled) {
      this.selectButton(index.toString());
    }
  }

}
