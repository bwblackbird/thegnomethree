import { Game } from "./game.js";

export const ITEMS = [
	{
		name: "Mushroom",
		cost: 1,
		effect: ()=> {
			Game.health++;
		},
		description: "This curious fungus restores your health."
	},
	{
		name: "Big Mushroom",
		cost: 2,
		effect: ()=> {
			Game.totalHealth++;
		},
		description: "Increases max health."
	},
	{
		name: "Jewel",
		cost: 1,
		effect: ()=> {
			Game.coins += 2;
		},
		description: "A very valuable jewel."
	},
]