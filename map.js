import Wall from "./objects/wall.js";
import { CELLSIZE, MAP_COLUMN_WIDTH, MAP_ROW_HEIGHT, HEX_SPRITE_SCALE } from "./config.js";

import { Draw } from "./engine/canvas.js";
import { HEXAGON_IMAGE, HEXAGON_SPRITE } from "./assets.js";

export class Map {
	constructor(width, height, world) {
		this.w = width;
		this.h = height;

		this.pixelWidth = width * MAP_COLUMN_WIDTH;
		this.pixelHeight = height * MAP_ROW_HEIGHT;

		this.world = world;
		this.createMap(this.w, this.h);
	}

	createMap(w, h) {
		this.map = new Array(h);
		for (let y = 0; y < h; y++) {
			this.map[y] = new Array(w);
			for (let x = 0; x < w; x++) {
				this.map[y][x] = [
					Math.round(Math.random()), // Tile
					0 // Overlay
				];
				this.updateCell(x, y); // Spawn wall object
			}
		}
	}

	updateCell(x, y) {
		let id = this.getCell(x, y, 0);
		if (id == -1) {
			return; // Out of bounds
		}
		if (id == 0) {
			return; // No wall
		}
		let tileX = x * MAP_COLUMN_WIDTH;
		let tileY = y * MAP_ROW_HEIGHT
		if (x % 2 == 0) {
			tileY += MAP_ROW_HEIGHT / 2;
		}
		this.world.spawnObject("Wall", new Wall(this.world.world, tileX, tileY));
	};

	setCell(x, y, i) {
		if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
			return; // Out of bounds
		}
		this.map[y][x][i] = 1;
	}

	getCell(x, y, i) {
		if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
			return -1; // Out of bounds
		}
		return this.map[y][x][i];
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
				Draw.image(HEXAGON_IMAGE, HEXAGON_SPRITE.getFrame(tileId, 0), tileX, tileY, 0, HEX_SPRITE_SCALE,HEX_SPRITE_SCALE, 0.5,0.5);
			}
		}
	}
}