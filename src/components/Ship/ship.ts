interface ShipI {
	hit(): void;
	isSunk(): boolean;
}

class Ship implements ShipI {
	private length: number;
	private hits: number;

	constructor(length: number) {
		this.length = length;
		this.hits = 0;
	}

	hit() {
		if (this.isSunk()) return;
		this.hits += 1;
	}
	isSunk(): boolean {
		return this.hits === this.length;
	}
}

export default Ship;
