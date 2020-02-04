import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerNamesComponent } from './player-names/player-names.component';
import { BoardGameComponent } from './board-game/board-game.component';


const routes: Routes = [
  { path: 'player-names', component: PlayerNamesComponent },
  { path: 'board-game', component: BoardGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
