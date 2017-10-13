'use strict';

const utils = require('./at-root')('modules/es5/utils');

class RawRequired {
  constructor() {
    this.list = {};
  }
  push (id, n, x, y, z) {
    if (!(id in this.list))
      this.list[id] = [];
    this.list[id].push({
      n:n,
      x:x,
      y:y,
      z:z
    });
  }
  get (id) {
    if (!(id in this.list))
      return utils.dummy.Array;
    else
      return this.list[id];
  }
}

if (module) module.exports = RawRequired;