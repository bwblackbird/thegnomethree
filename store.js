import { Game } from './game.js';
import StateManager from './engine/state.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config.js';
import { RenderFont } from './engine/render.js';
import { Draw } from "./engine/canvas.js";

import { ITEMS } from "./items.js";

class StoreClass {
  constructor() {
	this.font = new RenderFont("Arial", 40);
  }

  load() {
	this.items = [];
	this.stock = [];
	for (let i = 0; i < 3; i++) {
		this.items.push(Math.floor(Math.random() * ITEMS.length));
		this.stock.push(1);
	}
	this.items.push(-1); // last item is continue
	this.stock.push(1); // last item is continue
	this.selection = 0;
	this.selections = this.items.length; // number of selections (last is continue)

  }

  update(dt) {
	this.timer = (this.timer + 0.6*dt) % 1.0;
  }

  draw() {
	Draw.setColor(0, 0, 0, 1.0);
	Draw.rectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	Draw.setColor(255, 255, 255, 1.0);
	Draw.setFont(this.font);
	Draw.text("GNOME DEPOT", SCREEN_WIDTH / 2, 150, "center", 0, 2, 2);
	Draw.text("Buy something!", SCREEN_WIDTH / 2, 220, "center");

	// Items
	for (let i = 0; i < this.items.length; i++) {
		if (i == this.selection) {
			Draw.setColor(255, 255, 255, 1.0);
		} else {
			Draw.setColor(180, 180, 180, 0.5);
		}
		let text = "Nothing";
		if (this.items[i] == -1) {
			text = "Continue";
		} else {
			let item = ITEMS[this.items[i]];
			text = `Item ${item.name} (${item.cost} Coin)`;
		}
		Draw.text(text, 400, 320 + i*50, "left", 0, 1, 1);
	}

	// Item description
	if (this.items[this.selection] != -1) {
		Draw.setColor(255, 255, 255, 1.0);
		let item = ITEMS[this.items[this.selection]];
		Draw.text(item.description, SCREEN_WIDTH / 2, SCREEN_HEIGHT - 100, "center", 0, 1, 1);

		if (Game.coins < item.cost) {
			Draw.setColor(255, 100, 100, 1.0);
			Draw.text("You cannot afford this.", SCREEN_WIDTH / 2, SCREEN_HEIGHT - 50, "center", 0, 1, 1);
		}
	}

	// HUD
	Game.drawHUD();
  }

  keyPress(key) {
	switch (key) {
	  case "Enter":
		this.buy(this.items[this.selection]);
		break;
	  case "Escape":
		StateManager.setState(Game, "resume");
		break;
	  case "ArrowUp":
		this.selection--;
		if (this.selection < 0) {
		  this.selection = this.items.length - 1;
		}
		break;
	  case "ArrowDown":
		this.selection++;
		if (this.selection >= this.items.length) {
		  this.selection = 0;
		}
		break;
	}
  }

  buy(id) {
	if (id === -1) {
		this.exit();
		return;
	}

	let item = ITEMS[id];
	if (this.stock[id] > 0 && Game.coins > 0) {
		Game.coins = Game.coins - item.cost;
		this.stock[id]--;
		item.effect();
		this.exit();
	}
  }

  exit() {
	StateManager.setState(Game, "resume");
  }
}

export const Store = new StoreClass();