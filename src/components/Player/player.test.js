import createGameBoard from "@/components/GameBoard/gameboard.js";
import createPlayer from "@/components/Player/player.js";
import Events from "@/events";

jest.mock("../../../__mocks__/pubsub.js");
jest.mock("@/components/GameBoard/gameboard.js", () => {
	return jest.fn().mockImplementation(() => {
		return {
			placeShip: jest.fn(),
		};
	});
});
describe("createPlayer", () => {
	let player;
	beforeEach(() => {
		const gameboardInstance = createGameBoard();
		const eventsInstance = new Events();
		player = createPlayer({ type: "human", gameboard: gameboardInstance, events: eventsInstance });
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("hello", () => {
		console.log(player);
		expect(1).toBe(1);
	});
});
