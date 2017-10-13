'use strict';


import { ajax } from './ajax.js';


var styleTag = document.createElement('style');
styleTag.textContent = 'auto-elem { display: inline-block; border: 1px solid red; padding: 10px;}';
document.head.appendChild(styleTag);


var parser = new DOMParser();
var documentCache = {};

var border = 0;



class AutoElem extends HTMLElement {
  static get observedAttributes() { return ['src']; }

  constructor() {
    super();
    
  }

  get src() { return this.getAttribute('src'); }
  set src(_src) { return this.setAttribute('src', _src); }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) { }
  connectedCallback() { }
  disconnectedCallback() { }
  adoptedCallback(oldDocument, newDocument) { }
}


customElements.define('auto-elem', AutoElem);