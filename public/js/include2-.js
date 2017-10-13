'use strict';


import { ajax } from './ajax.js';



var parser = new DOMParser();
var documentCache = {};



class HTMLInclude extends HTMLElement {
  static get observedAttributes() { return ['src', 'cache']; }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'closed' });
    this.fallbackSlot = document.createElement('slot');
    this.root.appendChild(this.fallbackSlot);
    this.cacheSymbol = Symbol();

    if (!this.hasAttribute('cache')) {
      this.cacheKey = this.cacheSymbol;
      documentCache[this.cacheKey] = {};
      this.cacheReady = true;
    }
  }

  get src() { return this.getAttribute('src'); }
  set src(_src) { return this.setAttribute('src', _src); }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    if (attributeName === 'cache') {
      let oldCacheKey = this.cacheKey;
      if (typeof newValue === 'string')
        this.cacheKey = newValue;
      else
        this.cacheKey = this.cacheSymbol;

      if (!(this.cacheKey in documentCache))
        documentCache[this.cacheKey] = {};

      this.cacheReady = true;

      if (oldCacheKey === this.cacheKey && this.src)
        this.src = this.src;
    }
    else if (attributeName === 'src' && this.cacheReady) {

      this.root.innerHTML = '';

      if (newValue !== null) {
        var currentCache = documentCache[this.cacheKey][newValue];
        if (currentCache) {
          if (currentCache.loaded)
            for (let node of currentCache.nodes)
              this.root.appendChild(node);
          else
            throw new Error(`<include-> load race consdition @${newValue}. src change rejected.`);
        }
        else {
          ajax(newValue)
            .then((xhr) => {
              if (xhr.status >= 200 && xhr.status < 300) {
                var doc = parser.parseFromString(xhr.response, 'text/html');
                var firstNode = doc.body.children[0];
                if (firstNode && firstNode.tagName.toLowerCase() === 'parsererror')
                  throw new Error(`<include-> parsererror @${newValue}.`);
                else {
                  currentCache = documentCache[this.cacheKey][newValue] = {
                    nodes: [],
                    loaded: false
                  };
                  for (let node of doc.head.childNodes) {
                    node = document.importNode(node, true);
                    currentCache.nodes.push(node);
                    this.root.appendChild(node);
                  }
                  for (let node of doc.body.childNodes) {
                    node = document.importNode(node, true);
                    currentCache.nodes.push(node);
                    this.root.appendChild(node);
                  }
                  currentCache.loaded = true;
                }
              }
            });
        }
      }

    }
  }

  connectedCallback() { }
  disconnectedCallback() { }
  adoptedCallback(oldDocument, newDocument) { }
}


customElements.define('include-', HTMLInclude);