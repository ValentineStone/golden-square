'use strict';


import {Utils} from './Utils.js';


var states = [];

window.onpopstate = function(_event)
{
	if
	(
		_event.state
		&& typeof _event.state._WindowState_stateID === 'number'
		&& states[_event.state._WindowState_stateID]
		&& states[_event.state._WindowState_stateID].func
	)
		func(_event);
}

export function push(_func, _url)
{
	var stateID =
	states.push
	({
		func: typeof _func === 'function' ? _func : Utils.dummy.ArrowFunction,
		url: _url
	});

	try
	{
		history.pushState({_WindowState_stateID:stateID}, undefined, _url);
	}
	catch (_error)
	{
		states[stateID].error = _error;
		throw _error;
	}
}

history.replaceState({});

window.WindowState = {push : push};
