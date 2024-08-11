import Ship from "@/components/Ship/ship";

describe("Ship", () => {
	let ship;
	beforeEach(() => {
		ship = new Ship(3);
	});
	test("hits should be recorded", () => {
		ship.hit();
		expect(ship.hits).toBe(1);
	});
	test("the ship should sunk if its hit count is equal to length", () => {
		ship.hit();
		ship.hit();
		ship.hit();
		expect(ship.isSunk()).toBe(true);
	});
});
