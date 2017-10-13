'use strict';

var anchoredModuleNodeStore = [];

export var getAnchor = function (_id) {
  return anchoredModuleNodeStore[_id];
}



class AnchoredModule extends HTMLElement {
  constructor() {
    super();

    var script = document.createElement('script');
    script.type = 'module';

    var anchorId =
      anchoredModuleNodeStore
      .push(script) - 1;

    var text = `var anchorId = ${anchorId};\n`;
    if (this.childElementCount === 0)
      text += this.textContent;
    else if (this.childElementCount === 1)
      text += this.children[0].textContent;

    script.textContent = text;

    this.parentNode.replaceChild(script, this);
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) { }
  connectedCallback() { }
  disconnectedCallback() { }
  adoptedCallback(oldDocument, newDocument) { }
}


customElements.define('anchored-module', AnchoredModule);