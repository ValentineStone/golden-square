'use strict';


import { ajax } from './ajax.js';



var parser = new DOMParser();
var documentCache = {};
var rawDocumentCache = {};



export class CEInclude extends HTMLElement {
  static get observedAttributes() { return ['src', 'cache']; }

  constructor() {
    super();

    this.root = this;
    this.__hasBeenConnected = false;

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
        var rawCache = rawDocumentCache[newValue];
        var currentCache = documentCache[this.cacheKey][newValue];
        if (currentCache) {
          if (currentCache.loaded)
            for (let node of currentCache.nodes)
              this.root.appendChild(node);
          else
            throw new Error(`<include-> load race condition @${newValue}. src change rejected.`);
        }
        else if (rawCache) {
          currentCache = documentCache[this.cacheKey][newValue] = {
            nodes: [],
            loaded: false
          };
          for (let node of rawCache) {
            node = document.importNode(node, true);
            this.root.appendChild(node);
            currentCache.nodes.push(node);
          }
          currentCache.loaded = true;
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
                  rawCache = rawDocumentCache[newValue] = [];
                  for (let node of doc.head.childNodes) {
                    rawCache.push(node);
                    node = document.importNode(node, true);
                    currentCache.nodes.push(node);
                    this.root.appendChild(node);
                  }
                  for (let node of doc.body.childNodes) {
                    rawCache.push(node);
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

  connectedCallback() {
    console.log(`<ce-include>(${this.__hasBeenConnected}) attached: `, this);
    if (this.__hasBeenConnected) return;
    this.__hasBeenConnected = true;
    if (this.getAttribute('shadow') !== 'false') {
      this.root = this.root.attachShadow({ mode: 'closed' });
      this.fallbackSlot = document.createElement('slot');
      this.root.appendChild(this.fallbackSlot);
    }    
  }
  disconnectedCallback() { console.trace(`<ce-include>(${this.__hasBeenConnected}) detached: `, this);}
  adoptedCallback(oldDocument, newDocument) { }
}


customElements.define('ce-include', CEInclude);