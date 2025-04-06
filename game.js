import { SpatialHash, updatePhysics, drawPhysics } from "./engine/physics.js";
import { Draw } from "./engine/canvas.js";
import { CELLSIZE, LEVEL_WIDTH, LEVEL_HEIGHT, IMAGE_SCALE } from "./config.js";
import { Map } from "./map.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./config.js";
import { Camera } from "./camera.js";
import StateManager from './engine/state.js';
import { generateRandomLevel} from "./randomlevel.js";
import { Win } from "./win.js";
import { Lose } from "./lose.js";

import { HUD_FONT, COIN_IMAGE, COIN_SPRITE, HEART_IMAGE, HEART_SPRITE } from "./assets.js";

import Player from "./objects/player.js";

class GameClass {
	constructor() {

	};

	load() {
		this.level = 1;

		this.time = 0; // Total time played

		this.totalHearts = 3;
		this.hearts = this.totalHearts;

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
		this.objects["Bullet"] = {};
		this.objects["Coin"] = {};
		this.objects["Wall"] = {};
		this.objects["Wall"].dontUpdate = true; // Don't update walls
		this.objects["Exit"] = {};

		// Generate map
		this.map = new Map(levelWidth, levelHeight, this);

		generateRandomLevel(this.map, this.level);
		this.map.setCell(14,14,1,4);

		this.player = this.spawnObject("Player", new Player(this.world, this.map.pixelWidth/2, this.map.pixelHeight/2, this.map));//levelWidth*CELLSIZE/2, levelHeight*CELLSIZE/2));
		this.player.totalHealth = this.totalHearts;
		this.player.health = this.player.totalHealth;
		this.player.winCallback = this.nextLevel.bind(this);
		this.player.loseCallback = this.lose.bind(this);

		this.map.createMapObjects(this.player);

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
		this.time += dt;

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

		// Update light
		// let lightSources = [];
		// for (const [id, obj] of Object.entries(this.objects["Player"])) {
		// 	lightSources.push(obj);
		// }
		// for (const [id, obj] of Object.entries(this.objects["Troll"])) {
		// 	lightSources.push(obj);
		// }
		// this.map.updateLight(lightSources);
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
		for (const [id, obj] of Object.entries(this.objects["Troll"])) {
			obj.draw();
		}
		
		for (const [id, obj] of Object.entries(this.objects["Coin"])) {
			obj.draw();
		}

		for (const [id, obj] of Object.entries(this.objects["Player"])) {
			obj.draw();
		}

		for (const [id, obj] of Object.entries(this.objects["Exit"])) {
			obj.draw();
		}
		for (const [id, obj] of Object.entries(this.objects["Bullet"])) {
			obj.draw();
		}
		Draw.pop();
		
		// DEBUG
		//drawPhysics(Draw, this.objects, this.world, -this.camera.x, -this.camera.y);

		// HUD
		Draw.setColor(255, 255, 255, 1.0);
		Draw.setFont(HUD_FONT, 10);
		Draw.text(`X ${this.player.coins}`, SCREEN_WIDTH - 120, 70);
		Draw.image(COIN_IMAGE, COIN_SPRITE.getFrame(0,0), SCREEN_WIDTH - 160, 70, 0, IMAGE_SCALE, IMAGE_SCALE, 0.5, 0.75);

		for (let heart = 0; heart < this.player.totalHealth; heart++) {
			let frame = HEART_SPRITE.getFrame(0,0);
			if (heart >= this.player.health) {
				frame = HEART_SPRITE.getFrame(1,0);
			}
			Draw.image(HEART_IMAGE, frame, 70 + heart*70, 70, 0, IMAGE_SCALE, IMAGE_SCALE, 0.5, 0.75);
		}

		Draw.text(`Level ${this.level}`, SCREEN_WIDTH/2, 70, "center");
	}

	keyPress(k) {
		this.player.keyPress(k);
	}

	keyRelease(k) {
		this.player.keyRelease(k);
	}

	nextLevel() {
		this.level++;

		if (this.level > 10) {
			StateManager.setState(Win, this.time);
		} else {
			this.start();
		}
	}

	lose() {
		StateManager.setState(Lose, this.level);
	}
}

export const Game = new GameClass();