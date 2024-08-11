import Gameboard from "@/components/GameBoard/gameboard";

describe("GameBoard", () => {
	let gameboard;
	beforeEach(() => {
		gameboard = new Gameboard();
	});
	test("board should be initialized in the right format", () => {
		expect(gameboard.board.length).toBe(Gameboard.size);
		expect(gameboard.board[0].length).toBe(Gameboard.size);
		expect(gameboard.board[0][0]).toBe("");
	});
	test("should be able to place a ship at specific coordinates", () => {
		const coords = { y: 1, x: 1 };

		gameboard.placeShip({ coords, length: 3 });

		const expectedCells = [
			[1, 1],
			[2, 1],
			[3, 1],
		];
		const initialShipObj = {
			length: 3,
			hits: 0,
		};

		for (const [y, x] of expectedCells) {
			expect(gameboard.board[y][x]).toEqual(initialShipObj);
		}
	});
	test("should prevent place ship outside the board boundaries", () => {
		const coords = { y: 11, x: 11 };
		const errorObj = {
			error: true,
			message: "Invalid ship placement",
		};
		expect(gameboard.placeShip({ coords, length: 3 })).toEqual(errorObj);
	});
	test("should prevent place ship on a filled cell", () => {
		const errorObj = {
			error: true,
			message: "Invalid ship placement",
		};

		const firstCoords = { y: 0, x: 0 };
		gameboard.placeShip({ coords: firstCoords, length: 3 });
		const secondCoords = { y: 1, x: 0 };
		expect(gameboard.placeShip({ coords: secondCoords, length: 4, horizontal: true })).toEqual(errorObj);
	});
	test("should prevent place ship directly adjacent to another one", () => {
		const errorObj = {
			error: true,
			message: "Invalid ship placement",
		};

		const firstCoords = { y: 0, x: 0 };
		gameboard.placeShip({ coords: firstCoords, length: 3 });
		const secondCoords = { y: 0, x: 1 };
		expect(gameboard.placeShip({ coords: secondCoords, length: 4 })).toEqual(errorObj);
	});
	test("should prevent place ship if its length won't fit the board", () => {
		const errorObj = {
			error: true,
			message: "Invalid ship placement",
		};

		const firstCoords = { y: 7, x: 0 };
		const secondCoords = { y: 0, x: 7 };
		expect(gameboard.placeShip({ coords: firstCoords, length: 4 })).toEqual(errorObj);
		expect(gameboard.placeShip({ coords: secondCoords, length: 4, horizontal: true })).toEqual(errorObj);
	});
	test("should be able to receive an attack at a specific coords", () => {
		const successfulHitReturnObj = {
			error: false,
			message: "a cell has been hit successfully",
		};

		const coords = { y: 5, x: 5 };
		expect(gameboard.receiveAttack(coords)).toEqual(successfulHitReturnObj);

		expect(gameboard.board[coords.y][coords.x]).toBe("x");
	});
	test("should be able to send hit and update the board to indicate a destroyed ship part", () => {
		const shipCoords = { y: 0, x: 0 };
		gameboard.placeShip({ coords: shipCoords, length: 5 });

		const attackCoords = { y: 1, x: 0 };
		gameboard.receiveAttack(attackCoords);

		expect(gameboard.board[shipCoords.y][shipCoords.x].hits).toBe(1);
		expect(gameboard.board[attackCoords.y][attackCoords.x]).toBe("#");
	});
	test("hits on previously attacked cells should be prevented", () => {
		const failedHitReturnObj = {
			error: true,
			message: "the cell has already been hit.",
		};

		const shipCoords = { y: 0, x: 0 };
		gameboard.placeShip({ coords: shipCoords, length: 5 });

		const attackCoordsOne = { y: 1, x: 0 };
		gameboard.receiveAttack(attackCoordsOne);

		expect(gameboard.receiveAttack(attackCoordsOne)).toEqual(failedHitReturnObj);

		const attackCoordsTwo = { y: 1, x: 1 };
		gameboard.receiveAttack(attackCoordsTwo);

		expect(gameboard.receiveAttack(attackCoordsTwo)).toEqual(failedHitReturnObj);
	});
	test("should be able to report if all ships are sunk or not", () => {
		const shipCoords = { y: 0, x: 0 };
		const shipLength = 3;
		gameboard.placeShip({ coords: shipCoords, length: shipLength });

		expect(gameboard.isAllShipsSunk()).toBe(false);

		for (let i = 0; i < shipLength; i++) {
			const attackCoords = { y: i, x: 0 };
			gameboard.receiveAttack(attackCoords);
		}

		expect(gameboard.isAllShipsSunk()).toBe(true);
	});
});
