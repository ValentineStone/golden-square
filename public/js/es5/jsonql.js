'use strict';



const utils = require('./utils');

const jsonql = {};



jsonql.cuery = function (_root, _query) {
  query(_root, _query).then(console.log).catch(console.log);
}

jsonql.juery = function (_root, _query) {
  query(_root, _query).then(JSON.stringify).then(console.log).catch(console.log);
}

jsonql.query = async function (_root, _query) {
  
  var environment;
  
  async function queryFunction(_root, _args) {
    if (typeof _root === 'function')
      return await _root.call(environment, ..._args);
    else
      return undefined;
  }

  async function query(_root, _query) {

    if (_query && typeof _query === 'object') {
      if (_query.constructor === Array) {
        if (_query.length) {
          var queryResult;
          if (typeof _query[0] === 'object') {
            if (Array.isArray(_query[0]))
              queryResult = await queryFunction(_root, _query[0]);
            else
              queryResult = await queryFunction(_root, [_query[0]]);
            for (let i = 1; i < _query.length; i++)
              queryResult = await query(queryResult, _query[i]);
          }
          else {
            queryResult = {};
            var root = _root instanceof Object ? _root : utils.dummy.Object;
            for (let key of _query)
              queryResult[key] = await query(root[key], key);
          }
          return queryResult;
        }
        else
          return await queryFunction(_root, utils.dummy.Array);
      }
      else {
        var queryResult = {};
        var root = _root instanceof Object ? _root : utils.dummy.Object;
        for (let key in _query)
          queryResult[key] = await query(root[key], _query[key], root);
        return queryResult;
      }
    }
    else
      if (_query || _query === undefined)
        return _root;
      else
        return undefined;
  }

  return await query(_root, _query);
}

jsonql.express = function (_root) {
  return async function (req, res, next) {
    try {
      console.log('\x1b[36m', req.body, '\x1b[0m');
      let resJson = await jsonql.query(_root, req.body);
      console.log('\x1b[32m', resJson, '\x1b[0m');
      res.json({ data: resJson });
    }
    catch (error) {
      console.log('\x1b[31m',error,'\x1b[0m');
      res.json({ error: error.toString() });
    }
  }
}




jsonql.querySync = function (_root, _query) {
  
  var environment;
  
  function queryFunction(_root, _args) {
    if (typeof _root === 'function')
      return _root.call(environment, ..._args);
    else
      return undefined;
  }

  function query(_root, _query) {

    if (_query && typeof _query === 'object') {
      if (_query.constructor === Array) {
        if (_query.length) {
          var queryResult;
          if (typeof _query[0] === 'object') {
            if (Array.isArray(_query[0]))
              queryResult = queryFunction(_root, _query[0]);
            else
              queryResult = queryFunction(_root, [_query[0]]);
            for (let i = 1; i < _query.length; i++)
              queryResult = query(queryResult, _query[i]);
          }
          else {
            queryResult = {};
            var root = _root instanceof Object ? _root : utils.dummy.Object;
            for (let key of _query)
              queryResult[key] = query(root[key], key);
          }
          return queryResult;
        }
        else
          return queryFunction(_root, utils.dummy.Array);
      }
      else {
        var queryResult = {};
        var root = _root instanceof Object ? _root : utils.dummy.Object;
        for (let key in _query)
          queryResult[key] = query(root[key], _query[key], root);
        return queryResult;
      }
    }
    else
      if (_query || _query === undefined)
        return _root;
      else
        return undefined;
  }

  return query(_root, _query);
}


if (module) module.exports = jsonql;