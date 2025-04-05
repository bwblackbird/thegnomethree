// Input Handler; This passes user inputs to the game with useful functions
import { canvas, canvasContainer } from './canvas.js';
import StateManager from './state.js';

// Recieve keyboard inputs
window.addEventListener("keydown", keyPressed)
window.addEventListener("keyup", keyReleased)

// Recieve mouse inputs
canvas.addEventListener("mousedown", mouseClicked)
canvas.addEventListener("mouseup", mouseReleased)
document.addEventListener("mousemove", mouseMoved)

// Keyboard inputs
function keyPressed(event) {
	event.preventDefault()
	StateManager.keyPress(event.key, event.code)
}
function keyReleased(event) {
	event.preventDefault()
	StateManager.keyRelease(event.key, event.code)
}

// Mouse inputs
let mouseScreenX = 0
let mouseScreenY = 0
function convertMouseCoordsToScreen(mouseX, mouseY) {
	var rect = canvas.getBoundingClientRect() // abs. size of element
	let scaleX = canvas.width / rect.width	// relationship bitmap vs. element for x
	let scaleY = canvas.height / rect.height  // relationship bitmap vs. element for y
	
	let screenX = Math.max(0, Math.min(canvas.width, (mouseX - rect.left) * scaleX))   // scale mouse coordinates after they have
	let screenY = Math.max(0, Math.min(canvas.height, (mouseY - rect.top) * scaleY))	 // been adjusted to be relative to element
	return [screenX, screenY]
}

function mouseMoved(event) {
	event.preventDefault();
	var pos = [event.clientX, event.clientY];
	
	[mouseScreenX, mouseScreenY] = convertMouseCoordsToScreen(pos[0], pos[1])
}

// Postion; returns [x, y]
function getMousePos() {
	return [mouseScreenX, mouseScreenY]
}

function mouseClicked(event) {
    // canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    // canvas.requestPointerLock();

	event.preventDefault();
	let [x, y] = getMousePos()
	StateManager.click(event.button, x, y)
}

function mouseReleased(event) {
	let [x, y] = getMousePos()
	StateManager.clickRelease(event.button, x, y)
}

function checkMouseInside(x, y, w, h) {
	// Check if mouse is inside a box
	return ((mouseScreenX > x) && (mouseScreenX < x+w) && (mouseScreenY > y) && (mouseScreenY < y+h))
}