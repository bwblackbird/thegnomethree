import { CELLSIZE, MAP_COLUMN_WIDTH, MAP_ROW_HEIGHT, HEX_SPRITE_SCALE } from "./config.js";
import Wall from "./objects/wall.js";
import Coin from "./objects/coin.js";
import Troll from "./objects/troll.js";
import Exit from "./objects/exit.js";
import GuntherWOLong from "./objects/gunther.js";

import { Draw } from "./engine/canvas.js";
import { HEXAGON_IMAGE, HEXAGON_SPRITE } from "./assets.js";

export class Map {
	constructor(width, height, world) {
		this.w = width;
		this.h = height;

		this.pixelWidth = (width-1) * MAP_COLUMN_WIDTH;
		this.pixelHeight = (height-1) * MAP_ROW_HEIGHT;

		this.world = world;
		this.createMap(this.w, this.h);
	}

	createMap(w, h) {
		this.map = new Array(h);
		for (let y = 0; y < h; y++) {
			this.map[y] = new Array(w);
			for (let x = 0; x < w; x++) {
				this.map[y][x] = [
					0, // Tile ID
					0, // Object ID
					// 0 // Light level
				];
			}
		}
	}

	findSpawn() {
		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				if (this.getCell(x, y, 1) === 5) {
					this.spawnX = x;
					this.spawnY = y;
					return true;
				}
			}
		}
		return false;
	}

	createMapObjects(player) {
		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				this.updateCell(x, y, player); // Spawn objects
			}
		}
	}

	updateCell(x, y, player) {
		// Make solid walls
		let tileId = this.getCell(x, y, 0);
		
		let tileX = x * MAP_COLUMN_WIDTH;
		let tileY = y * MAP_ROW_HEIGHT;
		if (x % 2 == 0) {
			tileY += MAP_ROW_HEIGHT / 2;
		}

		if (tileId === 1 || tileId === 2) {
			this.world.spawnObject("Wall", new Wall(this.world.world, tileX, tileY));
		}

		// Spawn objects
		let objectId = this.getCell(x, y, 1);
		if (objectId === 1) {
			// Coin
			this.world.spawnObject("Coin", new Coin(this.world.world, tileX, tileY));
		} else if (objectId === 2) {
			// Troll
			this.world.spawnObject("Troll", new Troll(this.world.world, tileX, tileY, this, player));
		} else if (objectId === 3) {
			// Exit
			this.world.spawnObject("Exit", new Exit(this.world.world, tileX, tileY));
		} else if (objectId === 4) {
			// Gunther
			this.world.spawnObject("Troll", new GuntherWOLong(this.world.world, tileX, tileY, this, player, this.world));
		} else if (objectId === 5) {
			this.spawnX = x;
			this.spawnY = y;
		}

	};

	setCell(x, y, layer, id) {
		if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
			return false; // Out of bounds
		}
		this.map[y][x][layer] = id;
	}

	getCell(x, y, layer) {
		if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
			return -1; // Out of bounds
		}
		return this.map[y][x][layer];
	}

	draw(camera) {
		// Only render on screen
		Draw.setColor(255, 255, 255, 1.0);
		let startX = Math.floor(camera.x / MAP_COLUMN_WIDTH);
		let startY = Math.floor(camera.y / MAP_ROW_HEIGHT);
		let endX = Math.ceil((camera.x + camera.viewW) / MAP_COLUMN_WIDTH);
		let endY = Math.ceil((camera.y + camera.viewH) / MAP_ROW_HEIGHT);
		for (let y = startY; y <= endY; y++) {
			for (let x = startX; x <= endX; x++) {
				let tileX = x * MAP_COLUMN_WIDTH;
				let tileY = y * MAP_ROW_HEIGHT
				if (x % 2 == 0) {
					tileY += MAP_ROW_HEIGHT / 2;
				}
				let tileId = this.getCell(x, y, 0);
				let light = this.getCell(x, y, 2);
				Draw.setColor(255, 255, 255, 1.0);
				Draw.image(HEXAGON_IMAGE, HEXAGON_SPRITE.getFrame(tileId, 0), tileX, tileY, 0, HEX_SPRITE_SCALE,HEX_SPRITE_SCALE, 0.5,0.5);
				// Draw.setColor(0, 0, 0, (1-light)*0.4);
				// Draw.rectangle(tileX-MAP_COLUMN_WIDTH/2, tileY-MAP_ROW_HEIGHT/2, MAP_ROW_HEIGHT, MAP_ROW_HEIGHT);
			}
		}
	}

	castRay(x, y, tx, ty) {
		// done in map units
		let dx = tx - x;
		let dy = ty - y;
		let steps = Math.max(Math.abs(dx), Math.abs(dy));
		let stepX = dx / steps;
		let stepY = dy / steps;
		let currentX = x;
		let currentY = y;
		// Check each step for walls
		for (let i = 0; i < steps; i++) {
			currentX += stepX;
			currentY += stepY;
			let tileX = Math.floor(currentX / MAP_COLUMN_WIDTH);
			let tileY = Math.floor(currentY / MAP_ROW_HEIGHT);
			if (tileX < 0 || tileX >= this.w || tileY < 0 || tileY >= this.h) {
				return -1; // Out of bounds
			}
			let tileId = this.getCell(tileX, tileY, 0);
			if (tileId === 1) {
				return [tileX, tileY]; // Wall found
			}
		}
		return -1; // No wall found
	}

	updateLight(lightSources) {
		for (let lighti = 0; lighti < lightSources.length; lighti++) {
			let lightSource = lightSources[lighti];
			let tileX = Math.floor(lightSource.x / MAP_COLUMN_WIDTH);
			let tileY = Math.floor(lightSource.y / MAP_ROW_HEIGHT);
			if (tileX < 0 || tileX >= this.w || tileY < 0 || tileY >= this.h) {
				continue; // Out of bounds
			}
			this.setCell(tileX, tileY, 2, lightSource.light);
		}
	}
}