'use strict';

let zIndexTop = 1;

let activeClients = new Set();

window.addEventListener('mousemove', evt => {
  if (activeClients.size)
    evt.preventDefault();
  for (let manager of activeClients)
    manager.drag(evt);
});

export class DragManager {
  constructor(dragbar, elem = dragbar) {
    this.elem = elem;
    this.dragbar = dragbar;
    this.dragbar.dragManager = this;
    this.elem.style.zIndex = zIndexTop;

    this.isBeingDragged = false;
    this.offsetX = 0;
    this.offsetY = 0;

    this.dragbar.addEventListener('mousedown', evt => {
      if (getComputedStyle(this.elem).position === 'static') return;
      let rect = this.elem.getBoundingClientRect();
      this.offsetX = evt.screenX - rect.left;
      this.offsetY = evt.screenY - rect.top;
      activeClients.add(this);
      this.tofront();
    });

    this.dragbar.addEventListener('mouseup', evt => {
      activeClients.delete(this);
    });
  }

  drag(evt) {
    this.elem.style.left = `${evt.screenX - this.offsetX}px`;
    this.elem.style.top = `${evt.screenY - this.offsetY}px`;
  }

  remove() {
    activeClients.remove(this);
  }

  tofront() {
    this.elem.style.zIndex = ++zIndexTop;
  }
}