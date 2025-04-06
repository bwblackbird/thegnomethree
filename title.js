import { Game } from './game.js';
import StateManager from './engine/state.js';
import { RenderFont } from './engine/render.js';
import { Draw } from "./engine/canvas.js";
import { TITLE_IMAGE, HUD_FONT } from "./assets.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config.js';

class TitleClass {
  constructor() {
	this.font = new RenderFont("Arial", 40);
  }

  load() {
	this.timer = 0;
  }

  update(dt) {
	this.timer = (this.timer + 0.6*dt) % 1.0;
  }

  draw() {
	Draw.setColor(255, 255, 255, 1.0);
	Draw.image(TITLE_IMAGE, null, 0, 0, 0, 2, 2);

	Draw.setColor(255, 255, 255, 1.0);
	Draw.setFont(HUD_FONT, 8);
	if (this.timer < 0.5) {
	  Draw.text("Press any key to start!", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 180, "center");
	}
  }

  keyPress() {
	StateManager.setState(Game);
  }
}

export const Title = new TitleClass();