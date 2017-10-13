'use strict';
if (!window.anchorNextSibligScriptNode)
(function(){
  var anchoredScriptNodeStore = [];
  console.log('herewego');
  window.anchorNextSibligScriptNode = function () {
    if (document.currentScript) {
      var anchorNode = document.currentScript.nextSibling;
      console.log(document.currentScript, anchorNode);
      if (anchorNode && anchorNode.tagName.toLowerCase() === 'script') {
        var anchoredScriptId = anchoredScriptNodeStore.push(anchorNode) - 1;
        anchorNode.textContent = `var anchoredScriptId = ${anchoredScriptId};\n` + anchorNode.textContent;
      }
      else
        throw new Error('No sibling script avaliable');
    }
    else
      throw new Error('document.currentScript is not accessible from current location');
  }

  window.getanchoredScriptNode = (_id) => anchoredScriptNodeStore[_id];
})();