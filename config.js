// Screen //
export const SCREEN_WIDTH = 1920; // Width of the screen
export const SCREEN_HEIGHT = 1080; // Height of the screen

// Map //
export const CELLSIZE = 180; // Vertical size of each hexagon in the map
export const MAP_ROW_HEIGHT = CELLSIZE; // Row spacing
export const MAP_COLUMN_WIDTH = (Math.sqrt(3) * CELLSIZE) / 2;; // Column spacing

export const HEX_SPRITE_WIDTH = CELLSIZE; // Width of the hexagon sprite
export const HEX_SPRITE_HEIGHT = CELLSIZE; // Height of the hexagon sprite

// Level //
export const LEVEL_WIDTH = 32; // How many hexagon cells horizontally
export const LEVEL_HEIGHT = 32; // How many hexagon cells vertically

// Objects //
// Player
export const PLAYER_SIZE = CELLSIZE * 0.5; // Vertical size of the player