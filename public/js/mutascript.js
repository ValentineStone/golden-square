'use strict';

var observer = new MutationObserver(function(mutations) {
 mutations.forEach(function(mutation) {
   console.log(mutation);
 });
});
observer.observe(document.body, { childList: true, subtree: true });
//observer.disconnect();