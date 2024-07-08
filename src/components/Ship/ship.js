function createShip({ len }) {
	let hits = 0;

	function hit() {
		hits += 1;
	}
	function isSunk() {
		return hits === len;
	}
	return {
		hit,
		isSunk,
	};
}

export default createShip;
