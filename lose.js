import { Game } from './game.js';
import StateManager from './engine/state.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config.js';
import { RenderFont } from './engine/render.js';
import { Draw } from "./engine/canvas.js";

class LoseClass {
  constructor() {
	this.font = new RenderFont("Arial", 40);
  }

  load(level) {
	this.level = level;
  }

  update(dt) {

  }

  draw() {
	Draw.setColor(0, 0, 0, 1.0);
	Draw.rectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	Draw.setColor(255, 0, 0, 1.0);
	Draw.setFont(this.font);
	Draw.text("You died!", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "center", Math.PI*0.05, 2.0, 2.0);

	Draw.setColor(255, 255, 255, 1.0);
	Draw.text(`You made it to level ${this.level}!`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 90, "center");
	Draw.text("Press any key to try again.", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 150, "center");
  }

  keyPress() {
	StateManager.setState(Game);
  }
}

export const Lose = new LoseClass();