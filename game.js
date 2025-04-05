import { SpatialHash, updatePhysics, drawPhysics } from "./engine/physics.js";
import { Draw } from "./engine/canvas.js";
import { CELLSIZE, LEVEL_WIDTH, LEVEL_HEIGHT } from "./config.js";
import { Map } from "./map.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./config.js";
import { Camera } from "./camera.js";

import Player from "./objects/player.js";

class GameClass {
	constructor() {

	};

	load() {
		this.start();
	}

	start() {
		const levelWidth = LEVEL_WIDTH;
		const levelHeight = LEVEL_HEIGHT;
		this.world = new SpatialHash(levelWidth*CELLSIZE, levelHeight*CELLSIZE, CELLSIZE*8);

		// Object
		this.objects = [];
		this.objects["Player"] = {};
		this.objects["Troll"] = {};
		this.objects["Coin"] = {};
		this.objects["Wall"] = {};

		// Generate map
		this.map = new Map(levelWidth, levelHeight, this);

		this.player = this.spawnObject("Player", new Player(this.world, this.map.pixelWidth/2, this.map.pixelHeight/2));//levelWidth*CELLSIZE/2, levelHeight*CELLSIZE/2));

		this.camera = new Camera(SCREEN_WIDTH, SCREEN_HEIGHT, 0, 0, this.map.pixelWidth, this.map.pixelHeight);
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

		// Update camera view
		this.camera.setFocus(this.player.x, this.player.y);
	}

	draw() {
		Draw.clear(255, 255, 255, 1.0);
		Draw.setColor(255, 255, 255, 1.0);
		Draw.rectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		
		Draw.push();
		Draw.translate(-this.camera.x, -this.camera.y);
		// Map
		this.map.draw(this.camera);
		// Objects
		for (const [id, obj] of Object.entries(this.objects["Player"])) {
			obj.draw();
		}
		Draw.pop();
		
		// DEBUG
		drawPhysics(Draw, this.objects, this.world, -this.camera.x, -this.camera.y);
	}

	keyPress(k) {
		this.player.keyPress(k);
	}

	keyRelease(k) {
		this.player.keyRelease(k);
	}
}

export const Game = new GameClass();