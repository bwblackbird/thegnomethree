import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';
import { Draw } from '../engine/canvas.js';
import { CELLSIZE, TROLL_SIZE, TROLL_HIT_COOL_DOWN, MAP_COLUMN_WIDTH, MAP_ROW_HEIGHT } from "../config.js";

import { TROLL_IMAGE, TROLL_SPRITE } from '../assets.js';
import { Animation } from '../engine/sprite.js';

import Creature from './creature.js';

export default class Troll extends Creature {
	constructor(spatialHash, x, y, map, target) {
		super(spatialHash, x, y, TROLL_SIZE, TROLL_SIZE, TROLL_SIZE/3);
		this.size = TROLL_SIZE;
		this.x = x;
		this.y = y;

		this.static = false;
		this.active = true;

		// Movement
		this.map = map;
		this.idleSpeed = 0.5*CELLSIZE;
		this.speed = 1.2*CELLSIZE;
		this.target = target;
		this.chaseDist = 5*CELLSIZE;
		this.hitDist = 1*CELLSIZE;

		this.oldTileX = Math.floor(this.x / MAP_COLUMN_WIDTH);
		this.oldTileY = Math.floor(this.y / MAP_ROW_HEIGHT);
		this.oldTargetTileX = 0;
		this.oldTargetTileY = 0;
		this.oldCastResult = false;

		this.angle = 0;
		this.idleTimer = 1;
		this.walkTimer = 0;
		this.hitTimer = 0;

		this.hitTime = TROLL_HIT_COOL_DOWN;
		this.damage = 1;

		// Graphics
		this.image = TROLL_IMAGE;
		this.animation = new Animation(TROLL_SPRITE, 0, 0);

		this.setPosition(x, y);
	}

	update(dt) {
		// Chase target (Player)
		let canChase = false;
		if (this.target) {
			let tx = this.target.x;
			let ty = this.target.y;
			let dx = tx - this.x;
			let dy = ty - this.y;
			let dist = Math.sqrt(dx*dx + dy*dy);
			if (dist < this.chaseDist) {
				let tileX = Math.floor(tx / MAP_COLUMN_WIDTH);
				let tileY = Math.floor(ty / MAP_ROW_HEIGHT);
				let targetTileX = Math.floor(tx / MAP_COLUMN_WIDTH);
				let targetTileY = Math.floor(ty / MAP_ROW_HEIGHT);

				let cast = this.oldCastResult;
				if (tileX !== this.oldTileX || tileY !== this.oldTileY || targetTileX !== this.oldTargetTileX || targetTileY !== this.oldTargetTileY) {
					// Cast ray only if the target has moved
					cast = this.map.castRay(this.x, this.y, tx, ty);
					this.oldCastResult = cast;
				}

				if (cast === -1) {
					// Chase
					this.idleTimer = 2;
					this.angle = Math.atan2(dy, dx);
					this.sx = Math.cos(this.angle) * this.speed;
					this.sy = Math.sin(this.angle) * this.speed;
					canChase = true;
				}

				this.oldTileX = tileX;
				this.oldTileY = tileY;
				this.oldTargetTileX = targetTileX;
				this.oldTargetTileY = targetTileY;
			}

			if (dist < this.hitDist) {
				this.hitTimer -= dt;
				if (this.hitTimer <= 0) {
					if (this.target.hurt) {
						this.target.hurt(this.damage);
					}
					this.hitTimer = this.hitTime;
				}
			}
		}

		if (!canChase) {
			// Idle
			if (this.idleTimer > 0) {
				this.sx = 0;
				this.sy = 0;
				this.idleTimer -= dt;
				if (this.idleTimer <= 0) {
					this.walkTimer = Math.random() * 2 + 1; // Random walk time between 1 and 3 seconds
					this.angle = Math.random() * Math.PI * 2; // Random angle for walk movement
				}
			} else {
				this.sx = Math.cos(this.angle) * this.idleSpeed;
				this.sy = Math.sin(this.angle) * this.idleSpeed;
				this.walkTimer -= dt;
				if (this.walkTimer <= 0) {
					this.idleTimer = Math.random() * 2 + 1; // Random idle time between 1 and 3 seconds
				}
			}
		}
	}

	draw() {
		Draw.setColor(255, 255, 255, 1.0);
		Draw.image(this.image, this.animation.getFrame(), this.x, this.y, 0, 1, 1, 0.5, 0.5);
	}

	collide(name, obj) {
		if (name == "Wall") {
			return true;
		}
		if (name == "Player" || name == "Troll") {
			return true;
		}
		if (name == "Coin") {
			return false;
		}
		return false;
	}
}