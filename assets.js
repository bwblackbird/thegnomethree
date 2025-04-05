import { RenderImage } from './engine/render.js'
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
export const COIN_SPRITE = new Sprite(GNOME_IMAGE, 2, 1, 64, 64);

