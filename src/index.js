import "./main.css";

import createGameBoard from "@/components/GameBoard/gameboard";
import createPlayer from "@/components/Player/player";
import Events from "@/events";
import dom from "@/components/DOM.js";
import createShip from "@components/Ship/ship";

function initApp() {
	const root = dom.root;

	const player1Events = new Events();
	const player1Board = createGameBoard(createShip, 10, player1Events);
	const player1 = createPlayer({ type: "human", gameboard: player1Board, events: player1Events });

	const player2Events = new Events();
	const player2Board = createGameBoard(createShip, 10, player2Events);
	const player2 = createPlayer({ type: "computer", gameboard: player2Board, events: player2Events });

	const heading = dom.createElement("h1", {}, "Welcome");

	dom.append(root, heading);
	dom.append(root, player1Board.render());
	dom.on(heading, "click", () => {
		console.log("clicked");
	});
}
document.addEventListener("DOMContentLoaded", initApp);
