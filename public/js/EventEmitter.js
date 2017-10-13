'use strict';

class EventEmitter
{
	constructor()
	{
		this._events = {};

		this.addListener = this.on;
	}

	on(eventName, listener)
	{
		var event = this._events[eventName];
		if (!event)
			event = this._events[eventName] = {on:[], once:[]};
		event.on.push(listener);
		return this;
	}
	once(eventName, listener)
	{
		var event = this._events[eventName];
		if (!event)
			event = this._events[eventName] = {on:[], once:[]};
		event.once.push(listener);
		return this;
	}
	emit(eventName, ...args)
	{
		var event = this._events[eventName];
		if (!event) return false;
		var listener;
        var hasListeners = event.on.length > 0;
		for (listener of event.on)
			listener(...args);
        if (!event.once.length) return hasListeners;
        var once = event.once;
        event.once = [];
		for (listener of once)
			listener(...args);
		return true;
	}
	removeAllListeners(eventName)
	{
		var event = this._events[eventName];
		if (!event) return this;
		event.on.length = 0;
		event.once.length = 0;
		return this;
	}
	removeListener(eventName, listener)
	{
		var event = this._events[eventName];
		if (!event) return this;
		var i;
		for (i = 0; i < event.on.length; i++)
			if (event.on[i] === listener)
			{
				event.on.splice(i,1);
				return this;
			}
		for (i = 0; i < event.once.length; i++)
			if (event.once[i] === listener)
			{
				event.once.splice(i,1);
				return this;
			}
		return this;
	}

	eventNames()
	{
		return this._events.keys();
	}
	getMaxListeners()
	{
		return Infinity;
	}
	listenerCount(eventName)
	{
		var event = this._events[eventName];
		if (!event) return 0;
		return event.on.length + event.once.length;
	}
	listeners(eventName)
	{
		var event = this._events[eventName];
		if (!event) return[];
		return event.on.concat(event.once);
	}
	prependListener(eventName, listener)
	{
		var event = this._events[eventName];
		if (!event)
			event = this._events[eventName] = {on:[], once:[]};
		event.on.unshift(listener);
		return this;
	}
	prependOnceListener(eventName, listener)
	{
		var event = this._events[eventName];
		if (!event)
			event = this._events[eventName] = {on:[], once:[]};
		event.once.unshift(listener);
		return this;
	}
	setMaxListeners(n)
	{
		return this;
	}
}

export {EventEmitter};