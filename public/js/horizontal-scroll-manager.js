'use strict';

export default class HorizontalScrollManager {
  constructor(elem, speed = 40) {
    this.speed = speed;
    this.elem = elem;

    this.elem.addEventListener('mousewheel', this.scrollHorizontally.bind(this));
  }
  
  scrollHorizontally(evt) {
    var delta = Math.max(-1, Math.min(1, (evt.wheelDelta)));
    this.elem.scrollLeft -= (delta * this.speed);
    evt.preventDefault();
  }
}