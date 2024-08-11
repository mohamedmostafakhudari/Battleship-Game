export function randomItemOfArr(arr: any[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function addClassNames(target: HTMLElement, cns: string[]) {
	for (const cn of cns) {
		target.classList.add(cn);
	}
}
export function removeClassNames(target: HTMLElement, cns: string[]) {
	for (const cn of cns) {
		target.classList.remove(cn);
	}
}
