class DOM {
	constructor() {
		this.root = document.querySelector("#root");
	}
	query(selector) {
		return this.root.querySelector(selector);
	}
	queryAll(selector) {
		return this.root.querySelectorAll(selector);
	}
	on(element, eventType, handler) {
		element.addEventListener(eventType, handler);
	}
	off(element, eventType, handler) {
		element.removeEventListener(eventType, handler);
	}
	createElement(tagName, attributes = {}, content = "") {
		const element = document.createElement(tagName);

		for (let attr in attributes) {
			element.setAttribute(attr, attributes[attr]);
		}
		if (content) {
			element.innerHTML = content;
		}
		return element;
	}
	toggleClass(element, className) {
		element.classList.toggle(className);
	}
	append(parent, child) {
		parent.appendChild(child);
	}
	remove(child) {
		child.parentNode.removeChild(child);
	}
}

const dom = new DOM();
export default dom;
