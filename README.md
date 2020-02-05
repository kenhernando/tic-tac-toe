# Tic Tac Toe Challenge

## Routes
There are 2 main routes for this application: player-names and board-game. Upon initializing application, player names will be asked. If a saved game exists, the application will restore player positions and current score.

## Components
* player-names - component containing the form where the players can input their names.
* The board-game - component contains the actual tic-tac-toe board where the players can play the game.
* result-dialog - component containing content to be displayed inside a dialog box when a player wins. 

## Services
* config service - this is where the initial configuration file(s) are placed. For this project, the default style for the buttons, player scores and tile labels are considered as initial configuration.
* data service - Acts as the in-memory database for **angular-in-memory-web-api**. This is where mock data resides.
* local storage service - service that access and saves player data to the local storage.
* player service - service that saves player data to backend using rest services. 

## Functions 
Comments within the code are in place to describe function use.