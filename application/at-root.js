'use strict';

var path = require('path');
var appDir = path.dirname(require.main.filename);

if (module)
    module.exports = (_dir) => require(path.join(appDir, _dir));