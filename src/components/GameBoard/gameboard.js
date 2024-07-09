import dom from "@/components/DOM";

function createGameBoard(shipFactory, size, events) {
	const board = Array.from({ length: size }, () => Array.from({ length: size }).fill(null));
	const ships = {};
	let domElem = null;
	events.subscribe("attack", receiveAttack);

	function render() {
		domElem = dom.createElement("div", {
			class: "grid grid-cols-10 w-[500px]",
		});
		for (let i = 0; i < board.length * board.length; i++) {
			const cell = dom.createElement(
				"div",
				{
					class: "border aspect-square",
				},
				"cell"
			);
			dom.append(domElem, cell);
		}

		return domElem;
	}
	function placeShip({ type, coords }) {
		if (coordsInvalid(coords)) throw new Error("Not a valid placement for the ship");
		ships[type] = shipFactory({ len: coords.length });
		for (const [x, y] of coords) {
			board[x][y] = ships[type];
		}
	}
	function receiveAttack(coords) {
		console.log(`Attack is received on coords ${coords}`);
		// check if the attack hit a ship
		const cell = board[coords.x][coords.y];
		if (cell === "X") return;
		if (cell) {
			// if true call hit method on the correct ship
			ships[cell].hit();
		} else {
			// if false record the hit coords in missesCoords
			board[cell] = "X";
		}
	}
	function isAllShipsSunk() {
		return Object.keys(ships).every((key) => ships[key].isSunk());
	}

	function coordsInvalid(coords) {
		return coords.some(([x, y]) => x >= board.length || y >= board.length || x < 0 || y < 0 || board[x][y]);
	}
	function updateBoard() {
		const newElement = render();
		const parentElem = domElem.parentElement;
		if (parentElem) {
			parentElem.replaceChild(newElement, domElem);
		}
		domElem = newElement;
	}
	return {
		placeShip,
		isAllShipsSunk,
		render,
	};
}

export default createGameBoard;
