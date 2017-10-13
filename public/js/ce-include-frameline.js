'use strict';

import {CEInclude} from './ce-include.js';
import './ce-frameline.js';

class CEIncludeFrameline extends CEInclude {
  constructor() {
    super();
    this.frameline = document.createElement('ce-frameline');
    this.frameline.root = this.root;
    this.root.appendChild(this.frameline);
    this.root = this.frameline;
  }
}


customElements.define('ce-include-frameline', CEIncludeFrameline);