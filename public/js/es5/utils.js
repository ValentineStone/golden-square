'use strict';


var utils =
{
	dummy:
	{
		Object: {},
		Array: [],
		Function: function(){},
		ArrowFunction: ()=>{},
		AsyncFunction: async function(){}
	}
};

if (module) module.exports = utils;