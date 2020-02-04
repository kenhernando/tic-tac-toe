import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerNamesComponent } from './player-names/player-names.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { BoardGameComponent } from './board-game/board-game.component';
import { ResultDialogComponent } from './result-dialog/result-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    PlayerNamesComponent,
    BoardGameComponent,
    ResultDialogComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule],

  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ResultDialogComponent]
})
export class AppModule { }
