'use strict';

var shadowModuleNodeStore = [];

window.getShadowModuleNode = function (_id) {
  return shadowModuleNodeStore[_id];
}



class ShadowModule extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'closed'});

    var script = document.createElement('script');
    script.type = 'module';

    var shadowModuleId =
      shadowModuleNodeStore
      .push(script) - 1;

    var text = `var shadowModuleId = ${shadowModuleId};\n`;
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


customElements.define('shadow-module', ShadowModule);