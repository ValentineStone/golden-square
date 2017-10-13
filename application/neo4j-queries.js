'use strict';

const endpoint = require('./endpoint');
const utils = require('./at-root')('modules/es5/utils');


var queries;

if (module)
  queries = module.exports;
else
  queries = {};


queries.listAllMatterials =`
  MATCH
`;

queries.loadMultipleArtsByOnePrice =`
FOREACH (record in $records | (
  FOREACH (art in record[1] | (
    CREATE (:Frame{art:art, price:record[0]})
`;