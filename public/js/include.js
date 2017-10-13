'use strict';


import { ajax } from './ajax.js';


var parser = new DOMParser();

export function include(src) {
  let includer = document.currentScript;
  if (includer && includer.parentElement)
    return ajax(src).then((xhr) => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let doc = parser.parseFromString(xhr.response, 'text/html');
        let firstNode = doc.body.children[0];
        if (firstNode && firstNode.tagName.toLowerCase() === 'parsererror')
          throw new Error(`include() parsererror @${newValue}.`);
        else {
          for (let node of doc.head.childNodes)
            includer.parentElement.insertBefore(document.importNode(node, true), includer);
          for (let node of doc.body.childNodes)
            includer.parentElement.insertBefore(document.importNode(node, true), includer);
        }
      }
    });
  else
    return false;
}

window.include = include;