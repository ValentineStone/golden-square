'use strict';

export default class HorizontalScrollManager {
  constructor(elem, speed = 40) {
    this.speed = speed;
    this.elem = elem;

    this.elem.addEventListener('mousewheel', this.scrollHorizontally.bind(this));
  }
  
  scrollHorizontally(evt) {
    if (evt.target === this.elem) {
      var delta = Math.max(-1, Math.min(1, (evt.wheelDelta)));
      this.elem.scrollLeft -= (delta * this.speed);
    }
  }
}