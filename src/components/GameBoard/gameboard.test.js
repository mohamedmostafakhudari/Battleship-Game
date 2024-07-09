import createShip from "@/components/Ship/ship.js";
import Events from "@/events.js";
import createGameBoard from "@/components/GameBoard/gameboard.js";

jest.mock("../../../__mocks__/pubsub.js");
jest.mock("@/components/Ship/ship.js", () => {
	return jest.fn().mockImplementation(() => {
		return {
			isSunk: jest.fn(),
		};
	});
});

describe("GameBoard", () => {
	let gameboard;
	beforeEach(() => {
		const eventsInstance = new Events();
		gameboard = createGameBoard(createShip, 10, eventsInstance);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	test("It should be able to place a ship with a character identifier and coords on the board", () => {
		gameboard.placeShip({
			type: "battleship",
			coords: [
				[0, 0],
				[0, 1],
				[0, 2],
				[0, 3],
			],
		});

		expect(gameboard.board[0][0]).toBeDefined();
		expect(gameboard.board[0][1]).toBeDefined();
		expect(gameboard.board[0][2]).toBeDefined();
		expect(gameboard.board[0][3]).toBeDefined();
		expect(gameboard.board[0][4]).toBeNull();
		expect(gameboard.board[1][0]).toBeNull();
	});
	test("Ship placement should not intersect", () => {
		gameboard.placeShip({
			type: "battleship",
			coords: [
				[0, 0],
				[0, 1],
				[0, 2],
				[0, 3],
			],
		});

		expect(() =>
			gameboard.placeShip({
				type: "destroyer",
				coords: [
					[0, 0],
					[1, 0],
					[2, 0],
				],
			})
		).toThrow();
	});
	test("Placing a ship with coords exceeding the board limits should be prevented", () => {
		expect(() =>
			gameboard.placeShip({
				type: "submarine",
				coords: [
					[2, 8],
					[2, 9],
					[2, 10],
				],
			})
		).toThrow();
	});
	test("Should be able to report if all ships are sunk", () => {
		expect(
			gameboard.isAllShipsSunk([
				{
					isSunk: true,
				},
				{
					isSunk: true,
				},
				{
					isSunk: true,
				},
				{
					isSunk: true,
				},
			])
		).toBe(true);
	});
});
