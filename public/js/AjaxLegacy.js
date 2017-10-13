'use strict';


export function request(_url, _handler)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
			_handler(this.responseText);
	};
	xhttp.open("GET", _url, true);
	xhttp.send();
}

export function exchange(_address, _data_in, _handler)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
			_handler(this.responseText);
	};
	xhttp.open("POST", _address, true);
	xhttp.send(_data_in);
}

export function requestJSON(_url, _handler)
{
	request
	(
		_url,
		function (_json)
		{
			var json;
			try
			{
				json = JSON.parse(_json);
			}
			catch (_exc)
			{
				json = _json;
			}
			_handler(json);
		}
	);
}

export function exchangeJSON(_address, _json_in, _handler)
{
	exchange
	(
		_address,
		JSON.stringify(_json_in),
		function (_data)
		{
			var json_out;
			try
			{
				json_out = JSON.parse(_data);
			}
			catch (_exc)
			{
				json_out = _data;
			}
			_handler(json_out);
		}
	);
}

export function requestEval(_url)
{
	request(_url, eval);
}

export function requestInjectHTML(_url, _elem)
{
	request(_url, function (_injection) {_elem.innerHTML += _injection;});
}

export function requestOverrideHTML(_url, _elem)
{
	request(_url, function (_injection) {_elem.innerHTML = _injection;});
}