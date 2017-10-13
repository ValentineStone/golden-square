'use strict';

import {CEInclude} from '/js/ce-include.js';
import {DragManager} from '/js/drag-manager.js';

class CEIncludeWindow extends CEInclude {
  static get observedAttributes() { return ['title', 'src'] }

  constructor() {
    super();

    this.handlebarElement = document.createElement('div');
    this.closeElement = document.createElement('input');
    this.closeElement.type = 'button';
    this.closeElement.value = '×';
    this.snapElement = document.createElement('input');
    this.snapElement.type = 'button';
    this.snapElement.value = '~';
    this.titleElement = document.createElement('span');
    this.contentElement = document.createElement('div');

    this.handlebarElement.className = 'ce-window-handlebar';
    this.closeElement.className = 'ce-window-button ce-window-close-button';
    this.snapElement.className = 'ce-window-button ce-window-snap-button';
    this.titleElement.className = 'ce-window-title';
    this.contentElement.className = 'ce-window-content';

    this.closeElement.addEventListener('click', () => this.remove());
    this.snapElement.addEventListener('click', () => this.snap());

    new DragManager(this.handlebarElement, this);

    this.root = this.contentElement;

  }

  set title(title) { this.titleElement.textContent = title }
  get title() { return this.titleElement.textContent }

  snap() {
    if (this.hasAttribute('free'))
      this.removeAttribute('free');
    else
      this.setAttribute('free', 'true');
  }

  connectedCallback() {
    if (!this.__hasBeenConnected) {
      super.connectedCallback();
      this.handlebarElement.appendChild(this.closeElement);
      this.handlebarElement.appendChild(this.snapElement);
      this.handlebarElement.appendChild(this.titleElement);
      this.appendChild(this.handlebarElement);
      this.appendChild(this.contentElement);
    }
  }

  attributeChangedCallback(name, oldValue, newValue, namespace) {
    if (name === 'title')
      this.title = newValue;
    else
      super.attributeChangedCallback(name, oldValue, newValue, namespace);
  }
  disconnectedCallback() { }
  adoptedCallback(oldDocument, newDocument) { }
}


customElements.define('ce-inlude-window', CEIncludeWindow);