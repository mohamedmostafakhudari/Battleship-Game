// import { randomItemOfArr } from "@/utils";

import Gameboard, { Coords } from "@/components/GameBoard/gameboard";

export abstract class Player {
	protected boardInstance: Gameboard;
	protected opponentBoardInstance: Gameboard;
	protected type: "computer" | "player";

	constructor(type: "computer" | "player", boardInstance: Gameboard, opponentBoardInstance: Gameboard) {
		this.boardInstance = boardInstance;
		this.opponentBoardInstance = opponentBoardInstance;
		this.type = type;
	}
	abstract attack({ coords }: { coords?: Coords }): void;

	get BoardInstance(): Gameboard {
		return this.boardInstance;
	}
	get Type(): "computer" | "player" {
		return this.type;
	}
}

export class HumanPlayer extends Player {
	constructor(boardInstance: Gameboard, opponentBoardInstance: Gameboard) {
		super("player", boardInstance, opponentBoardInstance);
	}
	attack({ coords }: { coords?: Coords }) {
		if (!coords) throw new Error("Coords is required to execute an attack from a human player");
		this.opponentBoardInstance.receiveAttack(coords);
	}
}

export class ComputerPlayer extends Player {
	private nextHitsQueue: Coords[];
	private visited: Coords[];

	constructor(boardInstance: Gameboard, opponentBoardInstance: Gameboard) {
		super("computer", boardInstance, opponentBoardInstance);
		this.nextHitsQueue = [];
		this.visited = [];
	}
	attack() {
		const availableCells = this.opponentBoardInstance.getPossibleAttackTargets();
		const targetCoords = this.nextHitsQueue.length ? this.nextHitsQueue.shift() : availableCells[Math.floor(Math.random() * availableCells.length)];
		console.log(this.visited);
		console.log(this.nextHitsQueue);
		console.log(availableCells);
		console.log(targetCoords);

		if (targetCoords) {
			this.opponentBoardInstance.receiveAttack(targetCoords);

			if (this.visited.some((cell) => cell.y === targetCoords.y && cell.x === targetCoords.x)) return;

			const hitCell = this.opponentBoardInstance.Board[targetCoords.y][targetCoords.x];
			if (hitCell.cell === "#") {
				const possibleNextHits = [
					[targetCoords.y - 1, targetCoords.x],
					[targetCoords.y + 1, targetCoords.x],
					[targetCoords.y, targetCoords.x - 1],
					[targetCoords.y, targetCoords.x + 1],
				];
				for (const hit of possibleNextHits) {
					const [y, x] = hit;
					const coord = {
						y,
						x,
					};
					if (availableCells.some((cell) => cell.y === coord.y && cell.x === coord.x)) {
						this.nextHitsQueue.push(coord);
					}
				}
			}
			this.visited.push(targetCoords);
			if (hitCell.cell === "#") {
				this.attack();
			}
		}
	}
}
