'use strict';


import { ajax } from './ajax.js';
import './htmlImport.js';



class HTMLImportTabs extends HTMLElement {
  static get observedAttributes() { return ['cache']; }

  constructor() {
    super();

    if (this.hasAttribute('shadow'))
      this.root = this.attachShadow({ mode: 'closed' });
    else
      this.root = this;

    if (this.hasAttribute('autoclick'))
      for (let tab of this.children) {
        if (tab.slot) continue;
        let tagName = tab.tagName.toLowerCase();
        if (
          tagName === 'style'
          || tagName === 'script'
          || tagName === 'shadow-module'
        )
          tab.slot = 'head';
        else
          tab.addEventListener('click', (_event) => this.src = _event.currentTarget.dataset.src);
      }

    this.tabSlot = document.createElement('slot');
    this.tabSlot.className = 'tab-bar';
    this.htmlImport = document.createElement('html-import');
    this.htmlImport.className = 'tab-body';
    this.fallbackSlot = document.createElement('slot');
    this.fallbackSlot.name = 'default';
    this.htmlImport.appendChild(this.fallbackSlot);
    this.headSlot = document.createElement('slot');
    this.headSlot.name = 'head';
    
    if (this.hasAttribute('cache'))
      this.htmlImport.setAttribute('cache', this.getAttribute('cache'));
    else
      this.preventedCacheDoubleChange = true;

    this.root.appendChild(this.headSlot);
    this.root.appendChild(this.tabSlot);
    this.root.appendChild(this.htmlImport);

    var tab = this.getAttribute('default');
    if (typeof tab !== 'number') tab = 0;
    this.htmlImport.src = this.children[tab].dataset.src;
  }

  get src() { return this.htmlImport.src; }
  set src(_src) { return this.htmlImport.src = _src; }
  
  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    if (attributeName === 'cache') {
      if (this.preventedCacheDoubleChange)
        this.htmlImport.setAttribute('cache', newValue);
      else
        this.preventedCacheDoubleChange = true;
    }
  }
   
  adoptedCallback(oldDocument, newDocument) {}
  connectedCallback() {}
  disconnectedCallback() {}
}


customElements.define('html-import-tabs', HTMLImportTabs);