import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';
import { Draw } from '../engine/canvas.js';
import { BULLET_SIZE, IMAGE_SCALE, BULLET_SPEED } from '../config.js';

import { BULLET_IMAGE, BULLET_SPRITE } from '../assets.js';

export default class Bullet extends PhysicsObject {
	constructor(spatialHash, x, y, angle) {
		super(spatialHash, x, y);
		
		this.x = x;
		this.y = y;
		this.size = BULLET_SIZE;

		this.shape = new Shape(
			-BULLET_SIZE / 2, -BULLET_SIZE / 2,
			BULLET_SIZE / 2, -BULLET_SIZE / 2,
			BULLET_SIZE / 2, BULLET_SIZE / 2,
			-BULLET_SIZE / 2, BULLET_SIZE / 2
		)

		this.static = false;
		this.active = true;

		this.damage = 1;

		// Movement
		this.speed = 2.5*BULLET_SPEED;
		this.sx = Math.cos(angle) * this.speed;
		this.sy = Math.sin(angle) * this.speed;

		// Graphics
		this.image = BULLET_IMAGE;

		this.setPosition(x, y);
	}

	update(dt) {
	}

	draw() {
		Draw.setColor(255, 255, 255, 1.0);
		Draw.image(this.image, BULLET_SPRITE.getFrame(0,0), this.x, this.y, 0, IMAGE_SCALE, IMAGE_SCALE, 0.5, 0.5);
	}

	collide(name, obj) {
		console.log(name);
		if (name == "Troll" || name == "GuntherWOLong") {
			return false;
		}
		if (name == "Player") {
			obj.hurt(this.damage);
		}
		this.destroy();
		return true;
	}
}