import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';
import { Draw } from '../engine/canvas.js';
import { CELLSIZE, PLAYER_SIZE, IMAGE_SCALE } from "../config.js";

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

		this.light = 8;

		this.angle = 0;

		// Collectibles
		this.coins = 0;
		this.totalHealth = 3;
		this.health = this.totalHealth;
		this.dead = false;

		// Callbacks
		this.winCallback = null;
		this.loseCallback = null;

		this.setPosition(x, y);
	}

	update(dt) {
		if (this.dead) {
			this.sx = 0;
			this.sy = 0;
			return;
		}

		let sx = 0
		let sy = 0
		if (this.buttons.left) {
			this.animation.setFrame(null, 1);
			sx -= 1
		}
		if (this.buttons.right) {
			this.animation.setFrame(null, 1);
			sx += 1
		}
		if (this.buttons.up) {
			this.animation.setFrame(null, 2);
			sy -= 1
		}
		if (this.buttons.down) {
			this.animation.setFrame(null, 0);
			sy += 1
		}
		
		this.sx = sx * this.speed;
		this.sy = sy * this.speed;

		if (!(this.sx == 0 && this.sy == 0)) {
			this.angle = Math.atan2(this.sy, this.sx);
		}
	}

	draw() {
		Draw.setColor(255, 255, 255, 1.0);

		let flip = 1;

		if (this.buttons.left) {
			this.animation.setFrame(null, 1);
			flip = -1;
		}
		if (this.buttons.right) {
			this.animation.setFrame(null, 1);
		}
		if (this.buttons.up) {
			this.animation.setFrame(null, 2);
		}
		if (this.buttons.down) {
			this.animation.setFrame(null, 0);
		}

		Draw.image(this.image, this.animation.getFrame(), this.x, this.y, 0, IMAGE_SCALE*flip, IMAGE_SCALE, 0.5, 0.7);
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
			case "0":
				this.hurt(1);
				break;
			case "9":
				this.exit();
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
		if (name == "Wall") {
			return true;
		}
		if (name == "Coin") {
			this.collectCoin();
			obj.destroy();
			return false;
		}
		if (name == "Troll") {
			return true;
		}
		if (name == "Exit") {
			this.exit();
			return true;
		}
		return false;
	}

	collectCoin() {
		this.coins++;
	}

	hurt(damage) {
		this.health -= damage;
		if (this.health <= 0) {
			this.die();
		}
	}

	die() {
		console.log("Player died");
		this.dead = true;
		if (this.loseCallback) {
			this.loseCallback(this);
		}
	}

	exit() {
		console.log("Player used exit");
		if (this.winCallback) {
			this.winCallback(this);
		}
	}
}