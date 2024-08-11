class DOM {
	constructor() {}
	query(selector: string): HTMLElement | null {
		return document.querySelector(selector);
	}
	queryAll(selector: string): NodeListOf<HTMLElement> | null {
		return document.querySelectorAll(selector);
	}
	on(element: HTMLElement, eventType: string, handler: (e?: Event) => void) {
		element.addEventListener(eventType, handler);
	}
	off(element: HTMLElement, eventType: string, handler: (e?: Event) => void) {
		element.removeEventListener(eventType, handler);
	}
	createElement(tagName: string, attributes: any = {}, content: string = "") {
		const element = document.createElement(tagName);

		for (let attr in attributes) {
			element.setAttribute(attr, attributes[attr]);
		}
		if (content) {
			element.innerHTML = content;
		}
		return element;
	}
	toggleClass(element: HTMLElement, className: string) {
		element.classList.toggle(className);
	}
	append(parent: HTMLElement, child: HTMLElement) {
		parent.appendChild(child);
	}
	remove(child: HTMLElement) {
		if (!child.parentNode) return;
		child.parentNode.removeChild(child);
	}
}

const dom = new DOM();
export default dom;
