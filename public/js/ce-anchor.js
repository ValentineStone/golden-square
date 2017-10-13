'use strict';

let anchors = [];

class CEAnchor extends HTMLElement {
  connectedCallback () {
    anchors.push(this);
  }
}
customElements.define('ce-anchor', CEAnchor);

export default function anchor() {
  return anchors.shift();
}