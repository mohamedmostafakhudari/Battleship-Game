class Events {
	events = {};

	subscribe(event, listener) {
		if (this.events.hasOwnProperty(event)) {
			this.events[event].push(listener);
		} else {
			this.events[event] = [listener];
		}
	}
	unsubscribe(event, listener) {
		this.events[event] = this.events[event].filter((lis) => lis.toString() !== listener.toString());
	}
	publish(event, data) {
		if (this.events.hasOwnProperty(event)) {
			for (const listener of this.events[event]) {
				listener(data);
			}
		}
	}
}
export default Events;
