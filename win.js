import { Game } from './game.js';
import StateManager from './engine/state.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config.js';
import { RenderFont } from './engine/render.js';
import { Draw } from "./engine/canvas.js";
import { WIN_IMAGE } from "./assets.js";

import { formatTime } from "./lib/time.js";

class WinClass {
  constructor() {
	this.font = new RenderFont("Arial", 40);
  }

  load(time, coins) {
	this.time = time;
	this.coins = coins;

	this.timer = 0;
  }

  update(dt) {
	this.timer = (this.timer + 0.6*dt) % 1.0;
  }

  draw() {
	Draw.setColor(255, 255, 255, 1.0);
	Draw.image(WIN_IMAGE, null, 0, 0, 0, 2, 2);

	Draw.setColor(255, 255, 255, 1.0);
	Draw.setFont(this.font);
	let scale = 0.4 * Math.sin(this.timer*Math.PI) + 2.0;
	Draw.text("You Win!", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "center", 0, scale, scale);

	// Fromat time to mm:ss
	Draw.text(`Total time: ${formatTime(this.time)}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50, "center");

	// Coins
	Draw.text(`Total coins: ${this.coins}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 100, "center");
  }

  keyPress() {
	// StateManager.setState(Game);
  }
}

export const Win = new WinClass();