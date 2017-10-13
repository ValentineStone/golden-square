'use strict';


import { ajax } from './ajax.js';
import { utils } from './utils.js';
import { parseValue } from './forms.js';


class SearchHint extends HTMLElement {
  static get observedAttributes() { }

  constructor() {
    super();

    this.input = this.previousElementSibling;
    this.ignoreBlur = 0;

    if (this.input)
      if (
        this.input instanceof HTMLTextAreaElement
        || this.input instanceof HTMLInputElement
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

    console.log(this.box);

    this.onRequest  = new Function('$data', 'return ' + this.getAttribute('request'));
    this.onResponse = new Function('$data', 'return ' + this.getAttribute('response'));

    if (this.hasAttribute('oninput'))
      this.input.addEventListener('input', () => this.showHints());
    else if (this.hasAttribute('onchange'))
      this.input.addEventListener('change', () => this.showHints());
    
    this.input.addEventListener('keydown', event => {
      if (event.keyCode === 9)
        this.ignoreBlur++;
      else if ((
        event.keyCode === 39
        || event.keyCode === 40
        ) && this.childElementCount
      ) {
        event.preventDefault();
        this.ignoreBlur++;
        this.box.firstChild.focus();
      }
      else if ((
        event.keyCode === 37
        || event.keyCode === 38
        ) && this.childElementCount
      ) {
        event.preventDefault();
        this.ignoreBlur++;
        this.box.lastChild.focus();
      }
    });
    this.input.addEventListener('blur', () => {
      if (this.ignoreBlur) return this.ignoreBlur--;
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
      hint.tabIndex = 0;
      hint.addEventListener('click', event => {
        this.value = text;
        this.box.innerHTML = '';
      });
      hint.addEventListener('keydown', event => {
        if (event.keyCode === 13)
          hint.click();
        else if (
          event.keyCode === 9
          && hint.nextSibling
        )
          this.ignoreBlur++;
        else if (
          event.keyCode === 37
          || event.keyCode === 38
        ) {
          event.preventDefault();
          this.ignoreBlur++;
          if (hint.previousSibling)
            hint.previousSibling.focus();
          else
            this.input.focus();
        }
        else if (
          event.keyCode === 39
          || event.keyCode === 40
        ) {
          event.preventDefault();
          this.ignoreBlur++;
          if (hint.nextSibling)
            hint.nextSibling.focus();
          else
            this.input.focus();
        }
      });
      hint.addEventListener('blur', () => {
        if (this.ignoreBlur) return this.ignoreBlur--;
        this.box.innerHTML = '';
      });
      hint.addEventListener('mouseover', () => {
        if (hint !== document.activeElement)
          this.ignoreBlur++;
        hint.focus();
      });
      this.box.appendChild(hint);
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
