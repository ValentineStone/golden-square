'use strict';

export function parseValue(_element, _value) {
  var value =
    arguments.length === 1
      ? (
        _element.value
          ? _element.value
          : _element.textContent
      ) : (_value);
  switch (_element.dataset.type) {
    case 'int':
      value = parseInt(value); break;
    case 'float':
      value = parseFloat(value); break;
    case 'json':
      try { value = JSON.parse(value); }
      catch (error) { }
      break;
    default:
      value = value.toString();
  }
  return value;
}


export function toJSON(_element, _dafultType, _json) {
  if (!_json) _json = {};

  var type =
    _element.dataset.type
      ? _element.dataset.type
      : _dafultType;

  var name =
    _element.name
      ? _element.name
      : _element.dataset.name;

  if (_element.value === undefined && _element.children.length)
    if (name) {
      let json = {};
      _json[name] = json;
      for (let element of _element.children)
        toJSON(element, type, json);
    }
    else
      for (let element of _element.children)
        toJSON(element, type, _json);
  else
    if (name) {
      if (
        _element.type === 'checkbox'
        || _element.type === 'radio'
      ) {
        if (typeof _json[name] !== 'object')
          _json[name] = {};
        _json[name][_element.value] = _element.checked;
      }
      else {
        var value =
          _element.value
            ? _element.value
            : _element.textContent;
        switch (type) {
          case 'int':
            value = parseInt(value); break;
          case 'float':
            value = parseFloat(value); break;
          case 'json':
            try { value = JSON.parse(value); }
            catch (error) { }
            break;
          default:
            value = value.toString();
        }
        _json[name] = value;
      }
    }
  return _json;
}