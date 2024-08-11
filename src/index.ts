import "./main.css";

import dom from "@/components/DOM";
import Game from "@/game";
import { HumanPlayer, ComputerPlayer } from "@/components/Player/player";
import { Gameboard, GameboardUI } from "@/components/GameBoard/gameboard";

const player1BoardContainer = dom.query("#player-one-board-container");
const player2BoardContainer = dom.query("#player-two-board-container");

const player1Board = new Gameboard(new GameboardUI(player1BoardContainer));
const player2Board = new Gameboard(new GameboardUI(player2BoardContainer));

player2Board.hideCells();

player2BoardContainer?.addEventListener("click", (e: Event) => {
	const target: HTMLElement | null = (e.target as HTMLElement).closest(".cell");
	if (!target) return;
	const coords = target.dataset.coords;
	if (coords) {
		const [y, x] = coords.split(",");
		const hitCell = player2.BoardInstance.Board[+y][+x].cell === "x" || player2.BoardInstance.Board[+y][+x].cell === "#";
		if (hitCell) return;
		game.playRound({ playerOneAttackCoords: { y: +y, x: +x } });
	}
});

const player1 = new HumanPlayer(player1Board, player2Board);
const player2 = new ComputerPlayer(player2Board, player1Board);

const game = new Game({ player1, player2 });

const startGameBtn = dom.query("#start-game-btn");
startGameBtn?.addEventListener("click", () => {
	game.resetState();
	game.startGame();
	startGameBtn.textContent = "Restart";
});

const gameResultDialog: HTMLDialogElement | null = dom.query("#game-result-dialog") as HTMLDialogElement;
const gameResultDialogCloseBtn = gameResultDialog.querySelector(".close-btn");
const gameResultDialogPlayAgainBtn = gameResultDialog.querySelector(".again-btn");

gameResultDialogCloseBtn?.addEventListener("click", (e) => {
	game.closeGameResultDialog();
});
gameResultDialogPlayAgainBtn?.addEventListener("click", (e) => {
	game.closeGameResultDialog();
	game.resetState();
	game.startGame();
});
