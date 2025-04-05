import { SpatialHash, updatePhysics, drawPhysics } from "./engine/physics.js";
import { Draw } from "./engine/canvas.js";
import { Map, CELLSIZE } from "./map.js";
import { gameWidth, gameHeight } from "./engine/canvas.js";

import Player from "./objects/player.js";

class GameClass {
	constructor() {

	};

	load() {
		this.start();
	}

	start() {
		const levelWidth = 64;
		const levelHeight = 32;
		this.world = new SpatialHash(levelWidth*CELLSIZE, levelHeight*CELLSIZE, CELLSIZE*8);

		// Object
		this.objects = [];
		this.objects["Player"] = {};
		this.objects["Troll"] = {};
		this.objects["Coin"] = {};
		this.objects["Wall"] = {};

		// Generate map
		this.map = new Map(levelWidth, levelHeight, this);

		this.player = this.spawnObject("Player", new Player(this.world, 10, 10));//levelWidth*CELLSIZE/2, levelHeight*CELLSIZE/2));
	};

	// Register an object as part of the physics world
	spawnObject(name, obj, id) {
		if (id === undefined) {
			id = 0
			while (this.objects[name].hasOwnProperty(id.toString())) {
				id++
			}
		}
		this.objects[name][id] = obj
		return obj
	}

	update(dt) {
		for (const [name, objList] of Object.entries(this.objects)) {
			let keysToDelete;
			for (const [id, obj] of Object.entries(objList)) {
				if (obj.update) {
					obj.update(dt);
				};
				// Remove deleted objects
				if (obj.DELETED) {
					if (!keysToDelete) { keysToDelete = [] };
					keysToDelete.push(id);;
				}
			}
			if (keysToDelete) {
				keysToDelete.forEach(key => {
					delete objList[key];
				});
			}
		};
		updatePhysics(this.objects, this.world, dt);
	}

	draw() {
		Draw.clear(255, 255, 255, 1.0);
		Draw.setColor(255, 255, 255, 1.0);
		Draw.rectangle(0, 0, gameWidth, gameHeight);
		drawPhysics(Draw, this.objects, this.world, 0, 0);
		
		for (const [id, obj] of Object.entries(this.objects["Player"])) {
			obj.draw();
		}
	}

	keyPress(k) {
		this.player.keyPress(k);
	}

	keyRelease(k) {
		this.player.keyRelease(k);
	}
}

export const Game = new GameClass();