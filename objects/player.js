import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';
import { Draw } from '../engine/canvas.js';
import { CELLSIZE } from "../map.js";

import Creature from './creature.js';

export default class Player extends Creature {
	constructor(spatialHash, x, y) {
		super(spatialHash, x, y, CELLSIZE * 0.6, CELLSIZE * 0.6);
		this.size = CELLSIZE * 0.6;
		this.x = x;
		this.y = y;

		this.static = false;
		this.active = true;

		this.buttons = {
			up: false,
			down: false,
			left: false,
			right: false,
		}

		this.speed = 2*CELLSIZE;

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
		Draw.setColor(200, 0, 0);
		Draw.rectangle(this.x, this.y, this.size, this.size);
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
}