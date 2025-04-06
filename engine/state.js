// State Handler; Handles which "mode" the game is currently in.
// For example: the world shouldn't update if you're playing a minigame
// Functions to interact with states
let game_state = false
let game_state_name = ""
let open_menu = false

class StateManagerClass {
	constructor() {

	}
	setState(state, ...args) {
		state.load(...args);
		game_state = state;
		game_state_name = game_state.name;
	}

	getState() {
		return game_state_name;
	}

	update(dt) {
		game_state.update(dt);
	}

	draw() {
		game_state.draw();
	}

	keyPress(key, code) {
		if (game_state.keyPress) {
			game_state.keyPress(key, code);
		}
	}
	keyRelease(key, code) {
		if (game_state.keyRelease) {
			game_state.keyRelease(key, code);
		}
	}

	click(button, x, y) {
		if (game_state.mouseClick) {
			game_state.mouseClick(button, x, y);
		}
	}
	clickRelease(button, x, y) {
		if (game_state.mouseRelease) {
			game_state.mouseRelease(button, x, y);
		}
	}

	stateScroll(dy) {
		if (game_state.mouseScroll) {
			game_state.mouseScroll(dy);
		}
	}
}

export default new StateManagerClass();