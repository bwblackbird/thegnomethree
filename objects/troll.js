import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';
import { Draw } from '../engine/canvas.js';
import { CELLSIZE, TROLL_SIZE, TROLL_HIT_COOL_DOWN, MAP_COLUMN_WIDTH, MAP_ROW_HEIGHT, IMAGE_SCALE } from "../config.js";

import { TROLL_IMAGE, TROLL_SPRITE, TROLL_DEATH_SOUND } from '../assets.js';
import { Animation } from '../engine/sprite.js';
import AudioSystem from '../engine/audio.js';

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
		this.hitDist = 0.8*CELLSIZE;

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
		this.sprite = TROLL_SPRITE;
		this.animation = new Animation(this.sprite, 0, 0);

		this.wiggle = 0;
		this.wiggleSpeed = 5;
		this.wiggleStrength = 0.1;

		this.light = 3;

		this.dead = false;

		this.setPosition(x, y);
	}

	update(dt) {
		if (this.dead) {
			this.deadTimer -= dt;
			if (this.deadTimer <= 0) {
				this.destroy();
			}
			return true;
		}

		// Chase target (Player)
		this.canChase = false;
		if (this.target && !this.target.dead) {
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
					cast = this.map.castRay(this.x  + MAP_COLUMN_WIDTH/2, this.y + MAP_ROW_HEIGHT/2, tx  + MAP_COLUMN_WIDTH/2, ty + MAP_ROW_HEIGHT/2);
					this.oldCastResult = cast;
				}

				if (cast === -1) {
					// Chase
					this.idleTimer = 2;
					this.angle = Math.atan2(dy, dx);
					this.sx = Math.cos(this.angle) * this.speed;
					this.sy = Math.sin(this.angle) * this.speed;
					this.canChase = true;
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

		if (!this.canChase) {
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

		// Animation
		if (!(this.sx == 0 && this.sy == 0)) {
			this.wiggle = (this.wiggle + this.wiggleSpeed*dt)%1;
		} else {
			this.wiggle = 0;
		}

		// get current tile
		let tileX = Math.floor((this.x + MAP_COLUMN_WIDTH/2) / MAP_COLUMN_WIDTH);
		let tileY = Math.floor((this.y + MAP_ROW_HEIGHT/2) / MAP_ROW_HEIGHT);

		let tile = this.map.getCell(tileX, tileY, 0);
		if (tile == 5) {
			// die from spikes
			this.die();
			return true;
		}
	}

	draw() {
		let flip = 1;


		// Up
		if (this.angle > -Math.PI * 0.75 && this.angle < -Math.PI * 0.25) {
			this.animation.setFrame(null, 2);
		}
		// Down
		else if (this.angle > -Math.PI * 0.25 && this.angle <= Math.PI * 0.25) {
			this.animation.setFrame(null, 1);
		}
		// Left
		else if (this.angle < -Math.PI * 0.75 || this.angle > Math.PI * 0.75) {
			this.animation.setFrame(null, 1);
			flip = -1;
		}
		// Right
		else {
			this.animation.setFrame(null, 0);
		}

		let rotation = 0;
		if (this.dead) {
			rotation = Math.PI/2;
		}

		Draw.setColor(255, 255, 255, 1.0);
		Draw.image(this.image, this.animation.getFrame(), this.x, this.y-20, Math.sin(this.wiggle*Math.PI*2)*this.wiggleStrength+rotation, IMAGE_SCALE*flip, IMAGE_SCALE, 0.5, 0.65);
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

	die() {
		this.dead = true;
		this.active = false;
		this.static = true;
		this.deadTimer = 3.0;
		AudioSystem.playSound(TROLL_DEATH_SOUND);
	}
}