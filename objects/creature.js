import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';

export default class Creature extends PhysicsObject {
	constructor(spatialHash, x, y, w, h, bevel) {
		super(spatialHash, x, y);
		
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		// bevel hitbox so you slide into doorways
		if (bevel !== 0) {
			this.shape = new Shape(
				-this.w/2, -this.h/2+bevel,
				-this.w/2+bevel, -this.h/2,
				this.w/2-bevel, -this.h/2,
				this.w/2, -this.h/2+bevel,
				this.w/2, this.h/2-bevel,
				this.w/2-bevel, this.h/2,
				-this.w/2+bevel, this.h/2,
				-this.w/2, this.h/2-bevel
			)
		} else {
			this.shape = new Shape(
				-this.w/2, -this.h/2,
				-this.w/2, this.h/2,
				this.w/2, this.h/2,
				this.w/2, -this.h/2
			)
		}

		this.static = false;
		this.active = true;

		this.setPosition(x, y);
	}

	update(dt) {

	}

	draw() {

	}

	collide(name, obj) {
		if (name == "Wall") {
			return true;
		}
		return false;
	}
}