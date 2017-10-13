'use strict';

class CEScript extends HTMLElement {
  constructor () {
    super();
    this.style.display = 'none';
    this.hasBeenEvaled = false;
  }
  connectedCallback () {
    if (!this.hasBeenEvaled) {
      this.hasBeenEvaled = true;
      new Function('root',this.firstChild.textContent)(this.parentNode);
    }
  }

}

customElements.define('script-', CEScript);