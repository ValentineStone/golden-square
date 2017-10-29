'use strict';

import {DragManager} from '/js/drag-manager.js';

class CEWindow extends HTMLElement {
  static get observedAttributes() { return ['title'] }

  constructor() {
    super();

    this.handlebarElement = document.createElement('ce-window-handlebar');
    this.redElement = document.createElement('ce-window-button');
    this.yellowElement = document.createElement('ce-window-button');
    this.greenElement = document.createElement('ce-window-button');
    this.titleElement = document.createElement('ce-window-title');
    this.contentElement = document.createElement('ce-window-content');

    this.redElement.className = 'ce-window-red-button';
    this.yellowElement.className = 'ce-window-yellow-button';
    this.greenElement.className = 'ce-window-green-button';
    
    this._hasBeenConnected = false;

    this.redElement.addEventListener('click', () => this.remove());
    this.yellowElement.addEventListener('click', () => this.snap());

  }

  set title(title) { this.titleElement.textContent = title }
  get title() { return this.titleElement.textContent }

  snap() {
    if (this.hasAttribute('free')) {
      this.removeAttribute('free');
      this.style.height = '';
      this.style.width = '';
    }
    else {
      this.setAttribute('free', 'true');
      this.dragmanager.tofront();
    }
  }

  connectedCallback() {
    if (this._hasBeenConnected) return;
    this._hasBeenConnected = true;
    
    this.dragmanager = new DragManager(this.handlebarElement, this);

    while (this.childNodes.length > 0) {
      this.contentElement.appendChild(this.childNodes[0]);
    }

    this.handlebarElement.appendChild(this.redElement);
    this.handlebarElement.appendChild(this.yellowElement);
    this.handlebarElement.appendChild(this.greenElement);
    this.handlebarElement.appendChild(this.titleElement);
    this.appendChild(this.handlebarElement);
    this.appendChild(this.contentElement);
  }

  attributeChangedCallback(name, oldValue, newValue, namespace) {
    this.title = newValue;
  }
  disconnectedCallback() { }
  adoptedCallback(oldDocument, newDocument) { }
}


customElements.define('ce-window', CEWindow);