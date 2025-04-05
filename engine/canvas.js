// Hooks up to the html canvas

import {Render} from "./render.js";

export const canvasContainer = document.getElementById("canvasContainer");
export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

export const gameWidth = 1920;
export const gameHeight = 1080;

canvas.width = gameWidth;
canvas.height = gameHeight;

export const Draw = new Render(ctx, gameWidth, gameHeight);