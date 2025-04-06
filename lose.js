import { Game } from './game.js';
import StateManager from './engine/state.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config.js';
import { RenderFont } from './engine/render.js';
import { Draw } from "./engine/canvas.js";
import { LOSE_IMAGE } from "./assets.js";

class LoseClass {
  constructor() {
	this.font = new RenderFont("Arial", 40);
  }

  load(level) {
	this.level = level;

	this.timer = 0.5;
	this.deadScale = 4.0;
  }

  update(dt) {
	this.timer = Math.max(0, this.timer - dt);

	this.deadScale = Math.max(2.0, this.deadScale - 10*dt);
  }

  draw() {
	Draw.setColor(255, 255, 255, 1.0);
	Draw.image(LOSE_IMAGE, null, 0, 0, 0, 2, 2);

	Draw.setColor(255, 0, 0, 1.0);
	Draw.setFont(this.font);
	Draw.text("You died!", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 70, "center", Math.PI*0.05, this.deadScale, this.deadScale);

	Draw.setColor(255, 255, 255, 1.0);
	Draw.text(`You made it to level ${this.level}!`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 20, "center");
	if (this.timer === 0) {
		Draw.text("Press any key to try again.", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 100, "center");
	}
  }

  keyPress() {
	if (this.timer === 0) {
		StateManager.setState(Game);
  	}
  }
}

export const Lose = new LoseClass();