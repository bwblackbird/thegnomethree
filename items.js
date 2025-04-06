import { Game } from "./game.js";

export const ITEMS = [
	{
		name: "Red Mushroom",
		cost: 1,
		effect: ()=> {
			Game.health++;
		},
		description: "This curious fungus restores your health."
	},
	{
		name: "Heart Mushroom",
		cost: 5,
		effect: ()=> {
			Game.totalHealth++;
			Game.health++;
		},
		description: "This mushroom cures you and makes you grow another extra heart."
	},
	{
		name: "Jewel",
		cost: 1,
		effect: ()=> {
			Game.coins += 2;
		},
		description: "A very valuable jewel."
	},
	{
		name: "Lava-Proof Boots",
		cost: 3,
		effect: ()=> {
			Game.powerUp = 3;
		},
		description: "You can walk on lava with these."
	},
	{
		name: "Poison Immunity Potion",
		cost: 2,
		effect: ()=> {
			Game.powerUp = 4;
		},
		description: "This potion protects you from poison!"
	},
	{
		name: "Spike Shoes",
		cost: 2,
		effect: ()=> {
			Game.powerUp = 5;
		},
		description: "These shoes protect you from spikes."
	},
]