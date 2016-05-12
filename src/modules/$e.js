let $e = function (parameter, context) {
  if (!(this instanceof $e)) {
    return new $e(parameter, context);
  }

  // Allow for spaces before or after
  parameter = parameter.replace(/^\s*/, '').replace(/\s*$/, '');

  if (context) {
    return this.byCss(parameter, context);
  }

  for (var key in this.selectors) {
    // Reusing it to save space
    context = key.split('/');
    if ((new RegExp(context[1], context[2])).test(parameter)) {
      return this.selectors[key](parameter);
    }
  }

  return this.byCss(parameter);
};

// Select some elements using a css Selector
$e.prototype.byCss = function (parameter, context) {
  return (context || document).querySelectorAll(parameter);
};


$e.prototype.selectors = {};

// Find some html nodes using an Id
$e.prototype.selectors[/^\.[\w\-]+$/] = function (param) {
  return document.getElementsByClassName(param.substring(1));
};

//The tag nodes
$e.prototype.selectors[/^\w+$/] = function (param) {
  return document.getElementsByTagName(param);
};

// Find some html nodes using an Id
$e.prototype.selectors[/^\#[\w\-]+$/] = function (param) {
  return document.getElementById(param.substring(1));
};

export default $e;
