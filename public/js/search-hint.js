'use strict';


import { ajax } from './ajax.js';
import { utils } from './utils.js';
import { parseValue } from './forms.js';


class SearchHint extends HTMLElement {
  static get observedAttributes() { }

  constructor() {
    super();

    this.input = this.previousElementSibling;

    if (this.input)
      if (
        this.input instanceof HTMLTextAreaElement
        || this.input instanceof HTMLInputElement
        || this.input instanceof HTMLSelectElement
      )
        Object.defineProperty(this, 'value', {
          get: this.getinputValue,
          set: this.setinputValue
        });
      else if (this.input.contentEditable === 'true')
        Object.defineProperty(this, 'value', {
          get: this.getinputTextContent,
          set: this.setinputTextContent
        });
      else
        throw new Error('Element before <search-hint> is non-editable');
    else throw new Error('No element exists before <search-hint>');

    if (this.childElementCount)
      this.box = this.firstElementChild;
    else
      this.box = this;

    this.onRequest  = new Function('$data', 'return ' + this.getAttribute('request'));
    this.onResponse = new Function('$data', 'return ' + this.getAttribute('response'));

    if (this.hasAttribute('oninput'))
      this.input.addEventListener('input', () => this.showHints());
    else if (this.hasAttribute('onchange'))
      this.input.addEventListener('change', () => this.showHints());
    
    this.input.addEventListener('keydown', event => {
      if (this.box.childElementCount) {
        if (event.keyCode === 13 && this.selected) {
          this.value = this.selected.textContent;
          this.box.innerHTML = '';
          event.preventDefault();
        }
        else if (
          event.keyCode === 39
          || event.keyCode === 40
        ) {
          this.select('next');
          event.preventDefault();
        }
        else if (
          event.keyCode === 37
          || event.keyCode === 38
        ) {
          this.select('prev');
          event.preventDefault();
        }
      }
    });
    this.input.addEventListener('blur', () => {
      this.box.innerHTML = '';
    });
    
  }

  async showHints() {
    if (!this.value) return this.box.innerHTML = '';
    var request = this.onRequest(parseValue(this, this.value));
    var response = await ajax(this.target, 'json', request)
      .then(xhr => { return this.onResponse(xhr.response) })
      .then(arr => Array.isArray(arr) ? arr : utils.dummy.Array)
      .catch(() => utils.dummy.Array);
    this.box.innerHTML = '';
    var hintClass = this.hintClass;
    var hintStyle = this.hintStyle;
    for (let item of response) {
      let hint = document.createElement('div');
      let text = parseValue(this.input, item);
      hint.textContent = text;
      if (hintClass) hint.className = hintClass;
      if (hintStyle) hint.style.cssText = this.hintStyle;
      hint.addEventListener('mousedown', event => {
        this.value = text;
        this.box.innerHTML = '';
        event.preventDefault();
      });
      hint.addEventListener('mouseover', event => {
        this.select(event.currentTarget, false);
      });
      this.box.appendChild(hint);
    }
    this.select(this.box.firstElementChild);
  }

  select(element, doScroll = true) {
    if (this.selected) {
      if (element === 'next')
        element = this.selected.nextElementSibling || this.box.firstElementChild;
      else if (element === 'prev')
        element = this.selected.previousElementSibling || this.box.lastElementChild;
    }
    else {
      if (element === 'prev')
        element = this.box.lastElementChild;
      else
        element = this.box.firstElementChild;
    }
    
    if (this.selected && this.selected.parentElement)
      this.selected.classList.remove('selected');

    if (element instanceof HTMLElement) {
      this.selected = element;
      element.classList.add('selected');
      if (doScroll)
        element.scrollIntoView(false);
    }
  }

  getinputTextContent() { return this.input.textContent }
  setinputTextContent(textContent) { return this.input.textContent = textContent }

  getinputValue() { return this.input.value }
  setinputValue(value) { return this.input.value = value }

  get request() { return this.getAttribute('request') }
  set request(_request) { return this.setAttribute('request', _request) }

  get response() { return this.getAttribute('response') }
  set response(_response) { return this.setAttribute('response', _response) }

  get target() { return this.getAttribute('target') }
  set target(_target) { return this.setAttribute('target', _target) }
  
  get hintClass() { return this.getAttribute('hint-class') }
  get hintStyle() { return this.getAttribute('hint-style') }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) { }
  connectedCallback() { }
  disconnectedCallback() { }
  adoptedCallback(oldDocument, newDocument) { }
}


customElements.define('search-hint', SearchHint);
