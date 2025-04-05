import { RenderImage, RenderFont } from './engine/render.js'
import { Sprite } from './engine/sprite.js'

import { HEX_SPRITE_WIDTH, HEX_SPRITE_HEIGHT } from './config.js';

// Hexagons
export const HEXAGON_IMAGE = new RenderImage("assets/images/hexagon.png");
export const HEXAGON_SPRITE = new Sprite(HEXAGON_IMAGE, 6, 1, HEX_SPRITE_WIDTH, HEX_SPRITE_HEIGHT, 0,0, 1,1);

// Gnome
export const GNOME_IMAGE = new RenderImage("assets/images/gnome.png");
export const GNOME_SPRITE = new Sprite(GNOME_IMAGE, 4, 4, 64, 64);

// Coins
export const COIN_IMAGE = new RenderImage("assets/images/coin.png");
export const COIN_SPRITE = new Sprite(GNOME_IMAGE, 2, 1, 32, 32, 0,0, 1,1);

// Trolls
export const TROLL_IMAGE = new RenderImage("assets/images/troll.png");
export const TROLL_SPRITE = new Sprite(TROLL_IMAGE, 4, 4, 64, 64);

// HUD
export const HUD_FONT = new RenderFont("Arial", 40);
export const HEART_IMAGE = new RenderImage("assets/images/heart.png");
export const HEART_SPRITE = new Sprite(HEART_IMAGE, 2, 1, 32, 32, 0,0, 0,0);