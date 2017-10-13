const frames = [
  { id: 1, name: 'Twilight Sparkle', width: .22, pricetag: [879] },
  { id: 2, name: 'Pinkie Pie', width: .3, pricetag: [245] },
  { id: 3, name: 'Applejack', width: .6, pricetag: [99] },
  { id: 4, name: 'Rainbow Dash', width: .35, pricetag: [200] },
  { id: 5, name: 'Rarity', width: .4, pricetag: [1678] },
  { id: 6, name: 'Fluttershy', width: .1, pricetag: [234] },
];

const utils = require('./at-root')('modules/es5/utils');
const jsonql = require('./at-root')('modules/es5/jsonql');
const dbEndpoint = require('./db-endpoint');

var root;

if (module)
  root = module.exports;
else
  root = {};


root.version = '0.0.2';
root.db = { frames: frames };

root.materials = {
  get(id) { return frames[id]; },

  search : dbEndpoint.searchMaterial
};

root.echo = (_root, _jsonql) => {
  console.log(_root, _jsonql);
  return jsonql.query(_root, _jsonql);
};

root.calculate = require('./calculate');