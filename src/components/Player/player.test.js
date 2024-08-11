import { HumanPlayer, ComputerPlayer } from "@/components/Player/player";

describe("Player", () => {
	let humanPlayer;
	let computerPlayer;
	beforeEach(() => {
		humanPlayer = new HumanPlayer();
		computerPlayer = new ComputerPlayer();
	});

	test("a human player should be able to trigger an attack on a specific coords on the board", () => {
		const coords = {
			y: 0,
			x: 0,
		};
		const board = humanPlayer.boardInstance.board;

		humanPlayer.attack(coords);
		expect(board[coords.y][coords.x]).toBe("x");
	});
	test("a computer player should be able to trigger an attack on a random coords on the board", () => {
		const computerBoardBeforeAttack = JSON.stringify(computerPlayer.boardInstance.board);

		computerPlayer.attack();

		const computerBoardAfterAttack = JSON.stringify(computerPlayer.boardInstance.board);

		expect(computerBoardBeforeAttack === computerBoardAfterAttack).toBe(false);
	});
	test("each player should have its own board", () => {
		const coords = {
			y: 0,
			x: 0,
		};
		const computerPlayerBoard = computerPlayer.boardInstance.board;
		humanPlayer.attack(coords);

		expect(computerPlayerBoard[coords.y][coords.x]).toBe("");
	});
});
