import Troll from './troll.js';
import { GUNTHER_IMAGE, GUNTHER_SPRITE } from '../assets.js';

import Bullet from './bullet.js';

export default class GuntherWOLong extends Troll {
	constructor(spatialHash, x, y, map, target, world) {
		super(spatialHash, x, y, map, target);

		this.shootDelay = 1;
		this.shootTimer = this.shootDelay;

		this.world = world;

		this.image = GUNTHER_IMAGE;
	}

	update(dt) {
		super.update(dt);

		if (this.canChase) {
			this.shootTimer -= dt;
			if (this.shootTimer < 0) {
				this.shootTimer = this.shootDelay;
				this.shoot(this.angle);
			}
		}
	}

	draw() {
		super.draw();
	}

	shoot(angle) {
		this.world.spawnObject("Bullet", new Bullet(this.spatialHash, this.x, this.y, angle));
	}
}