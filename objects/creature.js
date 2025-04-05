import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';

export default class Creature extends PhysicsObject {
	constructor(spatialHash, x, y, w, h) {
		super(spatialHash, x, y);
		
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.shape = new Shape(
			0, 0,
			w, 0,
			w, h,
			0, h
		);

		this.static = false;
		this.active = true;
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