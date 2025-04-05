import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';
import { Draw } from '../engine/canvas.js';
import { CELLSIZE, PLAYER_SIZE } from "../config.js";

import { GNOME_IMAGE, GNOME_SPRITE } from '../assets.js';
import { Animation } from '../engine/sprite.js';

import Creature from './creature.js';

export default class Player extends Creature {
	constructor(spatialHash, x, y) {
		super(spatialHash, x, y, PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE/3);
		this.size = PLAYER_SIZE;
		this.x = x;
		this.y = y;

		this.static = false;
		this.active = true;

		// Movement
		this.buttons = {
			up: false,
			down: false,
			left: false,
			right: false,
		};
		this.speed = 2*CELLSIZE;

		// Graphics
		this.image = GNOME_IMAGE;
		this.animation = new Animation(GNOME_SPRITE, 0, 0);

		// Collectibles
		this.coins = 0;

		this.setPosition(x, y);
	}

	update(dt) {
		let sx = 0
		let sy = 0
		if (this.buttons.up) {
			sy -= 1
		}
		if (this.buttons.down) {
			sy += 1
		}
		if (this.buttons.left) {
			sx -= 1
		}
		if (this.buttons.right) {
			sx += 1
		}
		
		this.sx = sx * this.speed;
		this.sy = sy * this.speed;
	}

	draw() {
		Draw.setColor(255, 255, 255, 1.0);
		Draw.image(this.image, this.animation.getFrame(), this.x, this.y, 0, 1, 1, 0.5, 0.5);
	}

	keyPress(key) {
		switch (key) {
			case "ArrowUp":
				this.buttons.up = true;
				break;
			case "ArrowDown":
				this.buttons.down = true;
				break;
			case "ArrowLeft":
				this.buttons.left = true;
				break;
			case "ArrowRight":
				this.buttons.right = true;
				break;
		}
	}

	keyRelease(key) {
		switch (key) {
			case "ArrowUp":
				this.buttons.up = false;
				break;
			case "ArrowDown":
				this.buttons.down = false;
				break;
			case "ArrowLeft":
				this.buttons.left = false;
				break;
			case "ArrowRight":
				this.buttons.right = false;
				break;
		}
	}

	collide(name, obj) {
		console.log(name);
		if (name == "Wall") {
			return true;
		}
		if (name == "Coin") {
			this.collectCoin();
			obj.destroy();
			return false;
		}
		return false;
	}

	collectCoin() {
		this.coins++;
	}
}