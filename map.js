import Wall from "./objects/wall.js";

export const CELLSIZE = 180;

export class Map {
	constructor(width, height, world) {
		this.w = width;
		this.h = height;
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
		let tileX = x * CELLSIZE * 0.9 + (CELLSIZE / 2);
		let tileY = y * CELLSIZE + (CELLSIZE / 2);
		if (x % 2 == 0) {
			tileY += CELLSIZE / 2;
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
}