'use strict';

let globalFrameline = null;

class CEFrameLine extends HTMLElement {
	constructor() {
		super();
		if (this.hasAttribute('global'))
			globalFrameline = this;
	}

	push(elem) {
		this.appendChild(elem);
	}

	pop() {
		return this.removeChild(this.lastElementChild);
	}
}

customElements.define('ce-frameline', CEFrameLine);

export function push(elem) {
	if (globalFrameline)
		globalFrameline.push(elem);
}