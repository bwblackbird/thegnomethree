import { Game } from './game.js';
import StateManager from './engine/state.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config.js';
import { RenderFont } from './engine/render.js';
import { Draw } from "./engine/canvas.js";

class WinClass {
  constructor() {
	this.font = new RenderFont("Arial", 40);
  }

  load(time) {
	this.time = time;

	this.timer = 0;
  }

  update(dt) {
	this.timer = (this.timer + 0.6*dt) % 1.0;
  }

  draw() {
	Draw.setColor(0, 0, 0, 1.0);
	Draw.rectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	Draw.setColor(255, 255, 255, 1.0);
	Draw.setFont(this.font);
	let scale = 0.4 * Math.sin(this.timer*Math.PI) + 2.0;
	Draw.text("You Win!", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "center", 0, scale, scale);

	// Fromat time to mm:ss
	let minutes = Math.floor(this.time / 60);
	let seconds = Math.floor(this.time % 60);
	let time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	Draw.text(`Total time: ${time}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50, "center");
  }

  keyPress() {
	StateManager.setState(Game);
  }
}

export const Win = new WinClass();