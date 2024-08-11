// import dom from "@/components/DOM";
import Ship from "@/components/Ship/ship";
import dom from "@/components/DOM";
import clsx from "clsx";
import { addClassNames, removeClassNames } from "@/utils";
export type Cell = {
	cell: string | Ship;
	hidden: boolean;
};
export type Board = Array<Array<Cell>>;
export type Coords = {
	y: number;
	x: number;
};
interface GameboardI {
	placeShip({ coords, length, horizontal }: { coords: Coords; length: number; horizontal?: boolean }): {
		error: boolean;
		message: string;
	};
	receiveAttack(coords: { y: number; x: number }): {
		error: boolean;
		message: string;
	};
	isAllShipsSunk(): boolean;
	getPossibleAttackTargets(): Array<Coords>;
	getValidPlacementCoords({ shipLength, horizontal }: { shipLength: number; horizontal?: boolean }): Array<Coords>;
}

export class Gameboard implements GameboardI {
	private gameboardUIInstance: GameboardUI;
	private static size: number = 10;
	private board: Board;
	private ships: Array<Ship>;

	constructor(gameboardUIInstance: GameboardUI) {
		this.gameboardUIInstance = gameboardUIInstance;
		this.board = Array.from({ length: Gameboard.size }, () => {
			return Array.from({ length: Gameboard.size }, () => ({
				cell: "",
				hidden: false,
			}));
		});
		this.ships = [];

		this.gameboardUIInstance.render({ board: this.board });
	}
	static get Size(): number {
		return Gameboard.size;
	}
	get Board(): Board {
		return this.board;
	}
	placeShip({ coords, length, horizontal = false }: { coords: Coords; length: number; horizontal?: boolean }): {
		error: boolean;
		message: string;
	} {
		let error: boolean;
		let message: string;

		if (this.isValidCoords({ coords, length, horizontal })) {
			const ship = new Ship(length);

			this.ships.push(ship);

			if (horizontal) {
				this.placeHorizontalShip({ ship, coords, length });
			} else {
				this.placeVerticalShip({ ship, coords, length });
			}
			error = false;
			message = "A ship has been added successfully";
		} else {
			error = true;
			message = "Invalid ship placement";
		}

		this.gameboardUIInstance.render({ board: this.board });
		console.log(error, message);
		return {
			error,
			message,
		};
	}
	receiveAttack(coords: Coords): {
		error: boolean;
		message: string;
	} {
		const { y, x } = coords;
		const attackedCell = this.board[y][x];
		attackedCell.hidden = false;
		if (attackedCell.cell === "x" || attackedCell.cell === "#") {
			return {
				error: true,
				message: "the cell has already been hit.",
			};
		} else if (attackedCell.cell === "" || attackedCell.cell === ".") {
			this.board[y][x].cell = "x";
		} else if (typeof attackedCell.cell === "object") {
			attackedCell.cell.hit();
			this.board[y][x].cell = "#";
		}

		this.gameboardUIInstance.render({ board: this.board });

		return {
			error: false,
			message: "a cell has been hit successfully",
		};
	}
	isAllShipsSunk(): boolean {
		for (const ship of this.ships) {
			console.log(ship);
			if (!ship.isSunk()) return false;
		}
		return true;
	}
	getPossibleAttackTargets(): Array<Coords> {
		const cells = [];

		for (let y = 0; y < Gameboard.size; y++) {
			for (let x = 0; x < Gameboard.size; x++) {
				if (this.board[y][x].cell === "" || this.board[y][x].cell === "." || typeof this.board[y][x].cell === "object") {
					cells.push({
						y,
						x,
					});
				}
			}
		}
		return cells;
	}
	getValidPlacementCoords({ shipLength, horizontal = false }: { shipLength: number; horizontal?: boolean }): Array<Coords> {
		const cells = [];

		for (let y = 0; y < Gameboard.size; y++) {
			for (let x = 0; x < Gameboard.size; x++) {
				if (this.isValidCoords({ coords: { y, x }, length: shipLength, horizontal })) {
					cells.push({
						y,
						x,
					});
				}
			}
		}
		return cells;
	}
	clear() {
		this.board = Array.from({ length: Gameboard.size }, () => {
			return Array.from({ length: Gameboard.size }, () => ({
				cell: "",
				hidden: false,
			}));
		});
		this.ships = [];

		this.gameboardUIInstance.render({ board: this.board });
	}
	hideCells() {
		for (let y = 0; y < this.board.length; y++) {
			for (let x = 0; x < this.board.length; x++) {
				const cell = this.board[y][x];
				cell.hidden = true;
			}
		}
		this.gameboardUIInstance.render({ board: this.board });
	}
	private placeHorizontalShip({ ship, coords, length }: { ship: Ship; coords: Coords; length: number }) {
		if (coords.x - 1 >= 0) {
			this.board[coords.y][coords.x - 1].cell = ".";
		}
		for (let i = coords.x; i < coords.x + length; i++) {
			this.board[coords.y][i].cell = ship;

			if (coords.y - 1 >= 0) {
				this.board[coords.y - 1][i].cell = ".";
			}
			if (coords.y + 1 < Gameboard.size) {
				this.board[coords.y + 1][i].cell = ".";
			}
		}
		if (length + coords.x < Gameboard.size) {
			this.board[coords.y][length + coords.x].cell = ".";
		}
	}
	private placeVerticalShip({ ship, coords, length }: { ship: Ship; coords: Coords; length: number }) {
		if (coords.y - 1 >= 0) {
			this.board[coords.y - 1][coords.x].cell = ".";
		}

		for (let i = coords.y; i < coords.y + length; i++) {
			this.board[i][coords.x].cell = ship;

			if (coords.x - 1 >= 0) {
				this.board[i][coords.x - 1].cell = ".";
			}
			if (coords.x + 1 < Gameboard.size) {
				this.board[i][coords.x + 1].cell = ".";
			}
		}

		if (length + coords.y < Gameboard.size) {
			this.board[length + coords.y][coords.x].cell = ".";
		}
	}

	private isValidCoords({ coords, length, horizontal }: { coords: Coords; length: number; horizontal: boolean }): boolean {
		const { y, x } = coords;
		const inBoard = x >= 0 && x < Gameboard.size && y >= 0 && y < Gameboard.size;
		let possibleCells: Array<Coords> = [];
		let empty;
		let validResult;

		if (horizontal) {
			for (let i = 0; i < length; i++) {
				if (Array.isArray(this.board[y])) {
					if (x + i > Gameboard.Size - 1) break;
					possibleCells.push({
						y: y,
						x: x + i,
					});
				}
			}
		} else {
			for (let i = 0; i < length; i++) {
				if (Array.isArray(this.board[y + i])) {
					if (y + i > Gameboard.Size - 1) break;

					possibleCells.push({
						y: y + i,
						x: x,
					});
				}
			}
		}
		empty = possibleCells.every((cell) => {
			const { y, x } = cell;
			const cellCorners = [
				{
					y: y + 1 < Gameboard.Size ? y + 1 : Gameboard.Size - 1,
					x,
				},
				{
					y: y - 1 > 0 ? y - 1 : 0,
					x,
				},
				{
					y,
					x: x + 1 < Gameboard.Size ? x + 1 : Gameboard.Size - 1,
				},
				{
					y,
					x: x - 1 > 0 ? x - 1 : 0,
				},
			];
			return this.board[y][x].cell === "" && cellCorners.every((corner) => this.board[corner.y][corner.x].cell === "");
		});
		validResult = inBoard && empty && possibleCells.length === length && (horizontal ? x + length < Gameboard.size - 1 : y + length < Gameboard.size - 1);
		return validResult;
	}
}

export class GameboardUI {
	private container: HTMLElement | null;
	private placeShipDialog: HTMLElement | null;

	constructor(container: HTMLElement | null) {
		this.container = container;
		this.placeShipDialog = dom.query("#place-ship-dialog") as HTMLDialogElement;
		this.bindEvents();
	}
	render({ board }: { board: Board }) {
		if (this.container) {
			this.container.innerHTML = "";

			const shipClassname = `bg-green-600`;
			const missedClassname = `bg-sky-500/50`;
			const reservedClassname = `bg-gray-300/50`;
			const damageClassname = `bg-red-700`;
			const div = dom.createElement("div", { class: "board w-[400px] grid", style: `grid-template-columns: repeat(${Gameboard.Size},1fr);` });
			for (let y = 0; y < board.length; y++) {
				for (let x = 0; x < board.length; x++) {
					const cell = board[y][x];
					const cellType = this.getCellType(cell.cell);
					const hideClassName = "bg-slate-600";
					const cellClassName = clsx(
						`cell relative aspect-square border border-slate-300`,
						cellType === "ship" && shipClassname,
						cellType === "miss" && missedClassname,
						cellType === "reserved" && reservedClassname,
						cellType === "damage" && damageClassname,
						cell.hidden && hideClassName
					);
					const cellElem = dom.createElement("div", { class: cellClassName, "data-coords": `${y},${x}` });
					div.appendChild(cellElem);
				}
			}
			this.container.appendChild(div);
		}
	}

	searchBoardForDialogBtnMatch(coords: string) {
		if (this.container) {
			const board = this.container.firstElementChild;
			if (board) {
				const cells = [...board?.children];
				for (const cell of cells) {
					const cellCoords = cell.getAttribute("data-coords");
					if (cellCoords === coords) {
						return cell;
					}
				}
			}
		}
	}
	bindEvents() {
		this.placeShipDialog?.addEventListener("mouseover", (e) => {
			const target = (e.target as HTMLElement).closest("button");
			if (!target) return;
			const coords = target.textContent;
			if (coords) {
				const cell = this.searchBoardForDialogBtnMatch(coords);
				cell?.classList.add("bg-red-500");
				target.addEventListener("mouseleave", () => {
					cell?.classList.remove("bg-red-500");
				});
			}
		});
	}
	private getCellType(cell: Ship | string): string {
		if (typeof cell === "object") {
			return "ship";
		} else if (cell === "x") {
			return "miss";
		} else if (cell === ".") {
			return "reserved";
		} else if (cell === "#") {
			return "damage";
		} else {
			return "empty";
		}
	}
}

export default Gameboard;
