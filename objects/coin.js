import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';
import { Draw } from '../engine/canvas.js';
import { COIN_SIZE, COIN_ANIMATION_SPEED, IMAGE_SCALE } from '../config.js';

import { COIN_IMAGE, COIN_SPRITE } from '../assets.js';
import { Animation } from '../engine/sprite.js';

export default class Coin extends PhysicsObject {
	constructor(spatialHash, x, y) {
		super(spatialHash, x, y);
		
		this.x = x;
		this.y = y;
		this.size = COIN_SIZE;

		this.shape = new Shape(
			-COIN_SIZE / 2, -COIN_SIZE / 2,
			COIN_SIZE / 2, -COIN_SIZE / 2,
			COIN_SIZE / 2, COIN_SIZE / 2,
			-COIN_SIZE / 2, COIN_SIZE / 2
		)

		this.static = true;
		this.active = true;

		this.image = COIN_IMAGE;
		this.animation = new Animation(COIN_SPRITE, 0, 0);
		this.animation.playAnimation([0,1], COIN_ANIMATION_SPEED);

		this.setPosition(x, y);
	}

	update(dt) {
		this.animation.update(dt);
	}

	draw() {
		Draw.setColor(255, 255, 255, 1.0);
		Draw.image(this.image, this.animation.getFrame(), this.x, this.y, 0, IMAGE_SCALE, IMAGE_SCALE, 0.5, 0.5);
	}

	collide(name, obj) {
		return true;
	}
}