import PhysicsObject from './object.js';
import Shape from '../engine/shape.js';
import { CELLSIZE } from "../config.js";

export default class Wall extends PhysicsObject {
	constructor(spatialHash, x, y) {
		super(spatialHash, x, y);
		
		this.x = x;
		this.y = y;
		this.radius = CELLSIZE / Math.sqrt(3);

		// Hexagon shape
		this.shape = new Shape(...this.getHexagonVertices(x, y, this.radius));

		this.static = true;
		this.active = true;
		
		this.setPosition(x, y);
	}

    getHexagonVertices(cx, cy, radius) {
        // Calculate the vertices of the hexagon
        const vertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i; // 60 degrees in radians
            const vx = radius * Math.cos(angle);
            const vy = radius * Math.sin(angle);
            vertices.push(vx);
			vertices.push(vy);
        }
        return vertices;
    }

	update(dt) {

	}

	draw() {

	}

	collide(name, obj) {
		return true;
	}
}