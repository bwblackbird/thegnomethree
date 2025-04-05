export class Camera {
	constructor(viewW, viewH, minX, minY, maxX, maxY) {
		// Focus point
		this.focusX = 0;
		this.focusY = 0;

		// Camera size
		this.viewW = viewW;
		this.viewH = viewH;

		// Bounds
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;

		this.setFocus(this.focusX, this.focusY);
	}

	setFocus(focusX, focusY) {
		this.focusX = focusX;
		this.focusY = focusY;

		this.x = Math.floor(focusX - this.viewW / 2);
		this.y = Math.floor(focusY - this.viewH / 2);

		this.keepInBounds();
	}

	keepInBounds() {
		if (this.x < this.minX) {
			this.x = this.minX;
		}
		if (this.y < this.minY) {
			this.y = this.minY;
		}
		if (this.x + this.viewW > this.maxX) {
			this.x = this.maxX - this.viewW;
		}
		if (this.y + this.viewH > this.maxY) {
			this.y = this.maxY - this.viewH;
		}
	}
}