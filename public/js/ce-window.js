'use strict';

import {DragManager} from '/js/drag-manager.js';

class CEWindow extends HTMLElement {
  static get observedAttributes() { return ['title'] }

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
    
    this.__hasBeenConnected = false;

    this.closeElement.addEventListener('click', () => this.remove());
    this.snapElement.addEventListener('click', () => this.snap());

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
    if (this.__hasBeenConnected) return;
    this.__hasBeenConnected = true;
    
    this.dragmanager = new DragManager(this.handlebarElement, this);

    while (this.childNodes.length > 0) {
      this.contentElement.appendChild(this.childNodes[0]);
    }

    this.handlebarElement.appendChild(this.closeElement);
    this.handlebarElement.appendChild(this.snapElement);
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