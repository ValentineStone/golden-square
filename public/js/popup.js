'use strict';


var box = document.createElement('pre');
box.style.cssText = `
  margin: auto;
  overflow: auto;
  background: rgba(255,255,255,.7);
  box-sizing: border-box;
  max-height: 90%/*vh*/;
  max-width: 90%/*vw*/;
  border: 10px solid rgba(255,255,255,.6);
  padding: 10px;
  white-space: pre-wrap;
`;

var shade = document.createElement('div');
shade.appendChild(box);
shade.style.cssText = `
  height: 100%/*vh*/;
  width: 100%/*vw*/;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: rgba(0,0,0,.5);
  border: 10px solid rgba(255,255,255,.8);
  display: flex;
  align-items: center;
`;

shade.addEventListener('click', event => {
  if (event.currentTarget === event.target)
    shade.remove();
});

export function popup(_arg) {
  function popup({
    text = '',
    type = 'none',
    at = document.body
  } = {}) {
    box.textContent = text;
    at.appendChild(shade);
  }
  return popup(_arg);
}