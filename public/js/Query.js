'use strict';



import {Utils} from './Utils.js';



export function cuery(_root, _query)
{
	query(_root, _query).then(console.log).catch(console.log);
}

export function juery(_root, _query)
{
	query(_root, _query).then(JSON.stringify).then(console.log).catch(console.log);
}

export async function query(_root, _query)
{
	async function query(_root, _query, _this)
	{
		async function queryFunction(_root, _args, _query, _this)
		{
			if (typeof _root === 'function')
				return await query(await _root.call(_this, ..._args), _query);
		}

		if (typeof _query === 'object')
		{
			if (_query.constructor === Array)
			{
				if (_query.length === 0)
					return await queryFunction(_root, Utils.dummy.Array, true, _this);

				if (_query.length === 1)
					if (Array.isArray(_query[0]))
						return await queryFunction(_root, _query[0], true, _this);
					else if (typeof _query[0] === 'object' || typeof _query[0] === 'boolean')
						return await queryFunction(_root, Utils.dummy.Array, _query[0], _this);

				if (_query.length === 2)
					if (Array.isArray(_query[0]))
						return await queryFunction(_root, _query[0], _query[1], _this);
				
				var queryResult = {};
				var root = _root instanceof Object ? _root : Utils.dummy.Object;
				for (let key of _query)
					queryResult[key] = await query(root[key], key, _this);
				return queryResult;
			}
			else
			{
				var queryResult = {};
				var root = _root instanceof Object ? _root : Utils.dummy.Object;
				for (let key in _query)
					queryResult[key] = await query(root[key], _query[key], root);
				return queryResult;
			}
		}
		else if (_query)
			return _root;
	}

	return await query(_root, _query, _root);
}