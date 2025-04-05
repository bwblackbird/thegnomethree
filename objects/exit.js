import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';
import { Draw } from '../engine/canvas.js';
import { IMAGE_SCALE } from '../config.js';
import { EXIT_SIZE } from '../config.js';

import { EXIT_IMAGE, EXIT_SPRITE } from '../assets.js';
import { Animation } from '../engine/sprite.js';

export default class Exit extends PhysicsObject {
	constructor(spatialHash, x, y) {
		super(spatialHash, x, y);
		
		this.x = x;
		this.y = y;
		this.size = EXIT_SIZE;

		this.shape = new Shape(
			-EXIT_SIZE / 2, -EXIT_SIZE / 2,
			EXIT_SIZE / 2, -EXIT_SIZE / 2,
			EXIT_SIZE / 2, EXIT_SIZE / 2,
			-EXIT_SIZE / 2, EXIT_SIZE / 2
		)

		this.static = true;
		this.active = true;

		this.image = EXIT_IMAGE;

		this.setPosition(x, y);
	}

	update(dt) {
	}

	draw() {
		Draw.setColor(255, 255, 255, 1.0);
		Draw.image(this.image, EXIT_SPRITE.getFrame(0,0), this.x, this.y, 0, IMAGE_SCALE, IMAGE_SCALE, 0.5, 0.5);
	}

	collide(name, obj) {
		return true;
	}
}