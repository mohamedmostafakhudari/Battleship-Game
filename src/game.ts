import { Player, HumanPlayer, ComputerPlayer } from "@/components/Player/player";
import { Coords, Gameboard, GameboardUI } from "@/components/GameBoard/gameboard";
import dom from "@/components/DOM";
declare type PromiseConstructorLike = new <T>(executor: (resolve: (value?: Coords | PromiseLike<Coords>) => void, reject: (reason?: any) => void) => void) => PromiseLike<T>;
type ShipT = {
	type: string;
	length: number;
};
class Game {
	private ships: ShipT[];
	private currentMode: "idle" | "placement" | "play";
	private currentTurn: number;
	private placementMode: "horizontal" | "vertical";
	private playerOne: Player | null;
	private playerTwo: Player | null;

	private winner: Player | null;
	private gameOver: boolean;

	private placeShipDialog: HTMLDialogElement | null;

	constructor({ player1, player2 }: { player1: Player; player2: Player }) {
		this.ships = [
			{
				type: "carrier",
				length: 5,
			},
			{
				type: "battleship",
				length: 4,
			},
			{
				type: "destroyer",
				length: 3,
			},
			{
				type: "submarine",
				length: 3,
			},
			{
				type: "patrol boat",
				length: 2,
			},
		];
		this.currentMode = "idle";
		this.currentTurn = 1;
		this.placementMode = "vertical";
		this.playerOne = player1;
		this.playerTwo = player2;

		this.winner = null;
		this.gameOver = false;

		this.placeShipDialog = dom.query("#place-ship-dialog") as HTMLDialogElement;
	}
	get CurrentMode(): "idle" | "placement" | "play" {
		return this.currentMode;
	}
	set CurrentMode(mode: "idle" | "placement" | "play") {
		this.currentMode = mode;
	}
	get PlacementMode(): "horizontal" | "vertical" {
		return this.placementMode;
	}
	set PlacementMode(placement: "horizontal" | "vertical") {
		this.placementMode = placement;
	}
	startGame() {
		this.playerTwo?.BoardInstance.hideCells();
		this.runPlacement();
	}
	async runPlacement() {
		this.CurrentMode = "placement";

		GameUI.openPlaceShipDialog();
		for (let i = 0; i < this.ships.length; i++) {
			if (this.playerOne?.BoardInstance) {
				this.calcPossibleCoords({ board: this.playerOne?.BoardInstance, ship: this.ships[i], horizontal: this.placementMode === "horizontal" });
				const coords = await this.getShipPlacementCoords({ board: this.playerOne?.BoardInstance, ship: this.ships[i], horizontal: this.placementMode === "horizontal" });
				this.playerOne?.BoardInstance.placeShip({ coords: coords, length: this.ships[i].length, horizontal: this.placementMode === "horizontal" });
			}
		}
		GameUI.closePlaceShipDialog();

		if (this.playerTwo?.Type === "computer") {
			for (let i = 0; i < this.ships.length; i++) {
				let horizontal = Math.random() - 0.5 < 0 ? false : true;
				let validPlacementCoords = this.playerTwo?.BoardInstance.getValidPlacementCoords({ shipLength: this.ships[i].length, horizontal });
				// this part is necessary to allow the computer to test both modes of placement for a possible valid coords
				if (!validPlacementCoords.length) {
					validPlacementCoords = this.playerTwo?.BoardInstance.getValidPlacementCoords({ shipLength: this.ships[i].length, horizontal: !horizontal });
					horizontal = !horizontal;
				}
				if (validPlacementCoords) {
					this.playerTwo?.BoardInstance.placeShip({
						coords: validPlacementCoords[Math.floor(Math.random() * validPlacementCoords.length)],
						length: this.ships[i].length,
						horizontal: horizontal,
					});
				}
			}
		} else {
			// TODO Here would be the case if the opponent is a human player
		}
	}
	async getShipPlacementCoords({ board, ship, horizontal }: { board: Gameboard; ship: ShipT; horizontal: boolean }): Promise<Coords> {
		return new Promise((resolve, reject) => {
			const horizontalCheckbox = this.placeShipDialog?.querySelector(".horizontal") as HTMLInputElement;
			if (horizontalCheckbox) {
				// This part is responsible for recalculating the possible placement coords and set the current placement mode with every change to the horizontal chackbox
				horizontalCheckbox.onchange = (e) => {
					this.placementMode = this.placementMode === "horizontal" ? "vertical" : "horizontal";
					this.calcPossibleCoords({ board, ship, horizontal: this.placementMode === "horizontal" });
				};
			}
			this.placeShipDialog?.addEventListener("click", (e) => {
				const target = (e.target as HTMLElement).closest("button");
				if (!target) return;
				const coords = target.textContent?.split(",");
				if (coords) {
					const [y, x] = coords;
					resolve({
						y: +y,
						x: +x,
					});
				}
			});
		});
	}
	calcPossibleCoords({ board, ship, horizontal }: { board: Gameboard; ship: ShipT; horizontal: boolean }) {
		const possibleCoords = board.getValidPlacementCoords({ shipLength: ship.length, horizontal: horizontal });
		GameUI.updatePlaceShipDialogContent({ ship: ship, possibleCoords });
	}
	playRound({ playerOneAttackCoords }: { playerOneAttackCoords: Coords }) {
		if (!this.playerOne || !this.playerTwo) return;
		if (this.gameOver) return;

		this.playerOne?.attack({ coords: playerOneAttackCoords });

		let winner;
		winner = this.checkWinner();

		if (winner) {
			this.declareWinner(winner);

			this.winner = winner;
			this.gameOver = true;
		}

		// this logic will allow the players to play again if they hit a ship in the same turn
		const hitCell = this.playerTwo?.BoardInstance.Board[playerOneAttackCoords.y][playerOneAttackCoords.x];
		if (hitCell.cell === "#") return;

		this.playerTwo?.attack({});

		winner = this.checkWinner();

		if (winner) {
			this.declareWinner(winner);

			this.winner = winner;
			this.gameOver = true;
		} else {
			this.nextTurn();
		}
	}
	private nextTurn() {
		this.currentTurn++;
	}
	private checkWinner(): Player | false {
		if (!this.playerOne || !this.playerTwo) return false;
		console.log(this.playerTwo?.BoardInstance.isAllShipsSunk());
		if (this.playerOne?.BoardInstance.isAllShipsSunk()) {
			return this.playerTwo;
		}
		if (this.playerTwo?.BoardInstance.isAllShipsSunk()) {
			return this.playerOne;
		}
		return false;
	}
	private declareWinner(winner: Player) {
		GameUI.openGameResultDialog({ winner: winner.Type });
	}
	resetState() {
		if (this.playerOne && this.playerTwo) {
			this.playerOne?.BoardInstance.clear();
			this.playerTwo?.BoardInstance.clear();
		}
		this.currentTurn = 1;
		this.winner = null;
		this.gameOver = false;
		const horizontalCheckbox = this.placeShipDialog?.querySelector(".horizontal") as HTMLInputElement;
		horizontalCheckbox.checked = false;
		this.placementMode = "vertical";
	}
	closeGameResultDialog() {
		GameUI.closeGameResultDialog();
	}
}
class GameUI {
	static placeShipDialog = dom.query("#place-ship-dialog") as HTMLDialogElement;
	static gameResultDialog = dom.query("#game-result-dialog") as HTMLDialogElement;
	static createPlaceShipDialogButton(coord: Coords) {
		const { y, x } = coord;
		const button = document.createElement("button");
		button.className = `bg-blue-600 text-white rounded-lg w-16 py-1 text-lg`;
		button.textContent = `${y},${x}`;
		return button;
	}
	static updatePlaceShipDialogContent({ ship, possibleCoords }: { ship: { type: string; length: number }; possibleCoords: Coords[] | undefined }) {
		const dialogShipTypeText = this.placeShipDialog?.querySelector(".ship-type");
		const dialogShipLengthText = this.placeShipDialog?.querySelector(".ship-length");
		const dialogPossibleCoords = this.placeShipDialog?.querySelector(".possible-coords");

		if (!dialogShipTypeText || !dialogShipLengthText || !dialogPossibleCoords) return;

		dialogShipTypeText.textContent = ship.type;
		dialogShipLengthText.textContent = ship.length + "";
		if (possibleCoords) {
			dialogPossibleCoords.innerHTML = "";
			for (const coord of possibleCoords) {
				const button = GameUI.createPlaceShipDialogButton(coord);
				dialogPossibleCoords.appendChild(button);
			}
		}
	}
	static openPlaceShipDialog() {
		GameUI.placeShipDialog.showModal();
	}
	static closePlaceShipDialog() {
		GameUI.placeShipDialog.close();
	}
	static openGameResultDialog({ winner }: { winner: "player" | "computer" }) {
		const winnerText = GameUI.gameResultDialog.querySelector(".winner");
		if (winner.match(/player/i)) {
			winnerText?.classList.add("text-blue-500");
		} else if (winner.match(/computer/i)) {
			winnerText?.classList.add("text-red-500");
		}
		if (winnerText) {
			winnerText.textContent = winner;
		}
		GameUI.gameResultDialog.showModal();
	}
	static closeGameResultDialog() {
		GameUI.gameResultDialog.close();
	}
}
export default Game;
