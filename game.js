import { SpatialHash, updatePhysics, drawPhysics } from "./engine/physics.js";
import { Draw } from "./engine/canvas.js";
import { CELLSIZE, LEVEL_WIDTH, LEVEL_HEIGHT, IMAGE_SCALE, BONUS_TIME, MAP_COLUMN_WIDTH, MAP_ROW_HEIGHT } from "./config.js";
import { Map } from "./map.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./config.js";
import { Camera } from "./camera.js";
import StateManager from './engine/state.js';
import { generateRandomLevel} from "./randomlevel.js";
import { Win } from "./win.js";
import { Lose } from "./lose.js";
import { Store } from "./store.js";
import { ITEMS } from "./items.js";
import { formatTime } from "./lib/time.js";

import { HUD_FONT, SMALL_HUD_FONT, COIN_IMAGE, COIN_SPRITE, HEART_IMAGE, HEART_SPRITE } from "./assets.js";

import Player from "./objects/player.js";

class GameClass {
	constructor() {

	};

	load(resume) {
		if (!resume) {
			// Start fresh
			this.level = 1;

			this.time = 0; // Total time played

			this.totalHealth = 3;
			this.health = this.totalHealth;

			this.coins = 0;

			this.powerUp = false; // Item ID
		}
		this.levelTime = 0; // Time played in this level
		this.levelCoins = 0;

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

		console.log(this.map.spawnX, this.map.spawnY);
		let spawnX = this.map.w/2;
		let spawnY = this.map.h/2;
		this.map.findSpawn();
		if (this.map.spawnX !== undefined) {
			spawnX = this.map.spawnX;
			spawnY = this.map.spawnY;
			if (spawnX%2 == 0) {
				spawnY -= 0.5;
			}
		}

		this.player = this.spawnObject("Player", new Player(this.world, spawnX*MAP_COLUMN_WIDTH, spawnY*MAP_ROW_HEIGHT, this.map));//levelWidth*CELLSIZE/2, levelHeight*CELLSIZE/2));
		this.player.totalHealth = this.totalHealth;
		this.player.coins = this.coins;
		this.player.health = this.player.totalHealth;
		this.player.winCallback = this.nextLevel.bind(this);
		this.player.loseCallback = this.lose.bind(this);
		this.player.powerUp = this.powerUp;

		this.map.createMapObjects(this.player);

		this.camera = new Camera(SCREEN_WIDTH, SCREEN_HEIGHT, 0, 0, this.map.pixelWidth, this.map.pixelHeight + CELLSIZE/2);
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
		this.levelTime += dt;

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
		this.drawHUD();
	}

	drawHUD() {
		Draw.setColor(255, 255, 255, 1.0);
		Draw.setFont(HUD_FONT, 10);
		// Coins
		Draw.text(`X ${this.player.coins}`, SCREEN_WIDTH - 120, 70);
		Draw.image(COIN_IMAGE, COIN_SPRITE.getFrame(0,0), SCREEN_WIDTH - 160, 70, 0, IMAGE_SCALE, IMAGE_SCALE, 0.5, 0.75);

		// Health hearts
		for (let heart = 0; heart < this.player.totalHealth; heart++) {
			let frame = HEART_SPRITE.getFrame(0,0);
			if (heart >= this.player.health) {
				frame = HEART_SPRITE.getFrame(1,0);
			}
			Draw.image(HEART_IMAGE, frame, 70 + heart*70, 70, 0, IMAGE_SCALE, IMAGE_SCALE, 0.5, 0.75);
		}

		// Level display
		Draw.setFont(HUD_FONT, 10);
		Draw.text(`Level ${this.level}`, SCREEN_WIDTH/2, 70, "center");

		Draw.setFont(SMALL_HUD_FONT, 4);
		// Powerup item display
		if (this.powerUp) {
			let item = ITEMS[this.powerUp];
			Draw.setColor(255, 255, 255, 1.0);
			Draw.text(`Item: ${item.name}`, 40, 120, "left", 0, 1, 1);
		}

		// Time
		if (this.levelTime > 0) {
			Draw.setColor(255, 255, 255, 1.0);
			Draw.text(`Time: ${formatTime(this.levelTime)}`, SCREEN_WIDTH - 40, 120, "right", 0, 1, 1);
			if (this.levelTime < BONUS_TIME) {
				Draw.text(`X2 coin bonus under ${formatTime(BONUS_TIME)}!`, SCREEN_WIDTH - 40, 140, "right", 0, 1, 1);
			}
		}

		// Tutorial
		if (this.level == 1) {
			Draw.setColor(255, 255, 255, 1.0);
			Draw.text("Collect coins and find the ladder! Move with arrow keys.", SCREEN_WIDTH/2, SCREEN_HEIGHT - 50, "center", 0, 1, 1);
		}
	}

	keyPress(k) {
		this.player.keyPress(k);
	}

	keyRelease(k) {
		this.player.keyRelease(k);
	}

	nextLevel(noStore) {
		this.level++;

		this.coins = this.player.coins;
		this.health = this.player.health;
		this.totalHealth = this.player.totalHealth;

		// Coin bonus
		this.levelCoins = this.player.levelCoins;
		if (this.levelTime < BONUS_TIME) {
			this.coins += this.levelCoins; // 2X coins!
		}

		this.levelTime = 0;
		this.levelCoins = 0;

		this.powerUp = false;

		if (this.level > 10) {
			StateManager.setState(Win, this.time, this.coins);
		} else {
			if (noStore) {
				this.start();
			} else {
				StateManager.setState(Store);
			}
		}
	}

	lose() {
		StateManager.setState(Lose, this.level);
	}
}

export const Game = new GameClass();