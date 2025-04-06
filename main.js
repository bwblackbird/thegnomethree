

import { Title } from './title.js';
import StateManager from './engine/state.js';
import './engine/input.js';

StateManager.setState(Title);

var FPS = 0
var lastTimestamp = 0
function gameLoop(timestamp) {
	const dt = Math.min((timestamp - lastTimestamp) / 1000, 1/15); // Delta time; should be capped (currently at 15FPS)
	FPS = 1/((timestamp - lastTimestamp) / 1000);
	lastTimestamp = timestamp;
	
	StateManager.update(dt);
	StateManager.draw();

	requestAnimationFrame( gameLoop );
}
requestAnimationFrame( gameLoop );