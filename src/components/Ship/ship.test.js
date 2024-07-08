import createShip from "./ship";

describe("Ship", () => {
	const ship = createShip({ len: 3 });
	test("defines hit()", () => {
		expect(typeof ship.hit).toBe("function");
	});
	test("defines isSunk()", () => {
		expect(typeof ship.isSunk).toBe("function");
	});
	test("the ship should sunk if its hit count is equal to length", () => {
		ship.hit();
		ship.hit();
		ship.hit();
		expect(ship.isSunk()).toBe(true);
	});
});
