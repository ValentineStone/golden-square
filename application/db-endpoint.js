'use strict';

//const endpoint = require('./endpoint');
const jsonql = require('./at-root')('modules/es5/jsonql');
const utils = require('./at-root')('modules/es5/utils');
const neo4j = require('neo4j-driver').v1;
const neo4jDriver = () => neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "170310"));


var dbEndpoint;

if (module)
  dbEndpoint = module.exports;
else
  dbEndpoint = {};



dbEndpoint.searchMaterial = function (_article, _limit, _jsonql) {
  return new Promise(function (_resolve) {
    if (_article === '') return _resolve(utils.dummy.Array);
    const results = [];
    const driver = neo4jDriver();
    const session = driver.session();
    session
      .run('MATCH (m:Material) WHERE m.article STARTS WITH $article RETURN properties(m)', { article: _article, limit: _limit })
      .subscribe({
        onNext: function (record) {
          results.push(jsonql.querySync(record.get(0), _jsonql));
        },
        onCompleted: function () {
          session.close();
          driver.close();
          return _resolve(results);
        },
        onError: function (error) {
          console.log(error.toString());
          session.close();
          driver.close();
          return _resolve(utils.dummy.Array);
        }
      });
  });
};