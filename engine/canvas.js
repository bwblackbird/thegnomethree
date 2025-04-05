// Hooks up to the html canvas

import {Render} from "./render.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../config.js";

export const canvasContainer = document.getElementById("canvasContainer");
export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
ctx.imageSmoothingEnabled = false;

export const Draw = new Render(ctx, SCREEN_WIDTH, SCREEN_HEIGHT);