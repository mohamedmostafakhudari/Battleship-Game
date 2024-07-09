function createPlayer({ type, gameboard, events }) {
	function attack() {
		events.publish("attack", [0, 0]);
		if (type === "human") {
		} else if (type === "computer") {
		}
	}
	return {
		attack,
	};
}

export default createPlayer;
