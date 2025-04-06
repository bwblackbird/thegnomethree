import Troll from './troll.js';
import { GUNTHER_IMAGE, GUNTHER_SPRITE } from '../assets.js';

import Bullet from './bullet.js';
import { Animation } from '../engine/sprite.js';

export default class GuntherWOLong extends Troll {
	constructor(spatialHash, x, y, map, target, world) {
		super(spatialHash, x, y, map, target);

		this.shootDelay = 1;
		this.shootTimer = this.shootDelay;

		this.world = world;

		this.image = GUNTHER_IMAGE;
		this.sprite = GUNTHER_SPRITE;
		this.animation = new Animation(this.sprite, 0, 0);
	}

	update(dt) {
		if (super.update(dt)) {
			return true;
		}

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