// Screen //
export const SCREEN_WIDTH = 1280; // Width of the screen
export const SCREEN_HEIGHT = 720; // Height of the screen

// Map //
export const CELLSIZE = 90; // Vertical size of each hexagon in the map
export const MAP_ROW_HEIGHT = CELLSIZE; // Row spacing
export const MAP_COLUMN_WIDTH = (Math.sqrt(3) * CELLSIZE) / 2;; // Column spacing

export const HEX_SPRITE_WIDTH = 54; // Width of the hexagon sprite
export const HEX_SPRITE_HEIGHT = 45; // Height of the hexagon sprite
export const HEX_SPRITE_SCALE = 2.0; // Scale of the hexagon sprite

// Level //
export const LEVEL_WIDTH = 32; // How many hexagon cells horizontally
export const LEVEL_HEIGHT = 32; // How many hexagon cells vertically

export const LAVA_HIT_COOL_DOWN = 0.35; // Cool down time for lava hurting

// Objects //
// Player
export const PLAYER_SIZE = CELLSIZE * 0.5; // Vertical size of the player

// Coins
export const COIN_SIZE = CELLSIZE * 0.5; // Width and Height of a coin
export const COIN_ANIMATION_SPEED = 0.41;

// Trolls
export const TROLL_SIZE = CELLSIZE * 0.5; // Width and Height of a troll
export const TROLL_HIT_COOL_DOWN = 1.0;

// Exit
export const EXIT_SIZE = CELLSIZE * 0.5; // Width and Height of the exit

// Bullet
export const BULLET_SIZE = CELLSIZE * 0.4; // Width and Height of the bullet
export const BULLET_SPEED = 5 * CELLSIZE; // Speed of the bullet

// Graphics //
export const IMAGE_SCALE = 2.0; // Scale of all pixel images