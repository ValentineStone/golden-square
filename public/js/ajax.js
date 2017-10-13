'use strict';


export function ajax(_url, _type, _data)
{
	return new Promise
	(
		function(_resolve)
		{
			if (_type === 'json')
				_data = JSON.stringify(_data);

			var xhr = new XMLHttpRequest();
			xhr.responseType = typeof _type === 'string' ? _type : '';
			xhr.onreadystatechange =
			function()
			{
				if (this.readyState == 4)
					_resolve(this);
			};

			if (_data === undefined)
				xhr.open("GET", _url, true);
			else
				xhr.open("POST", _url, true);

			xhr.send(_data);
		}
	);
}