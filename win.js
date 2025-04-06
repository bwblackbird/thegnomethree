import { Game } from './game.js';
import StateManager from './engine/state.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config.js';
import { RenderFont } from './engine/render.js';
import { Draw } from "./engine/canvas.js";
import { WIN_IMAGE, COIN_SOUND } from "./assets.js";
import AudioSystem from './engine/audio.js';

import { formatTime } from "./lib/time.js";

class WinClass {
  constructor() {
	this.font = new RenderFont("Arial", 40);
  }

  load(time, coins) {
	this.time = time;
	this.coins = coins;

	this.timer = 0;

	// highscore from local storage
	this.highscore = localStorage.getItem("highestcoins");
	if (this.highscore == null) {
	  this.highscore = 0;
	}
	this.highscore = Math.floor(Math.max(this.highscore, this.time));
	localStorage.setItem("highestcoins", this.highscore);

	AudioSystem.playSound(COIN_SOUND);
  }

  update(dt) {
	this.timer = (this.timer + 0.6*dt) % 1.0;
  }

  draw() {
	Draw.setColor(255, 255, 255, 1.0);
	Draw.image(WIN_IMAGE, null, 0, 0, 0, 2, 2);

	let offsetX = 30;
	Draw.setColor(0, 0, 0 , 1.0);
	Draw.setFont(this.font);
	let scale = 0.4 * Math.sin(this.timer*Math.PI) + 2.0;
	Draw.text("You Win!", SCREEN_WIDTH / 2 + offsetX, SCREEN_HEIGHT / 2, "center", 0, scale, scale);

	// Fromat time to mm:ss
	Draw.text(`Total time: ${formatTime(this.time)}`, SCREEN_WIDTH / 2 + offsetX, SCREEN_HEIGHT / 2 + 50, "center");

	// Coins
	Draw.text(`Total coins: ${this.coins}`, SCREEN_WIDTH / 2 + offsetX, SCREEN_HEIGHT / 2 + 100, "center");

	Draw.text(`Highest coins ever: ${this.highscore}`, SCREEN_WIDTH / 2 + offsetX, SCREEN_HEIGHT / 2 + 200, "center");
	if (this.coins == this.highscore) {
	 	Draw.text("New highscore!", SCREEN_WIDTH / 2 + offsetX, SCREEN_HEIGHT / 2 + 230, "center", 0, 1.5, 1.5);
	}
  }

  keyPress() {
	AudioSystem.playSound(COIN_SOUND);
	// StateManager.setState(Game);
  }
}

export const Win = new WinClass();