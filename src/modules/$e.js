/**
 * Element Factory
 * @param  {String} parameter       - Element Selector
 * @param  {HTMLElement} context    - The parent to find the selector in
 * @return {HTMLElement/HTMLCollection}
 */
const $e = function (parameter, context) {
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

/**
 * Get an element by using querySelectorAll
 * @param  {String} parameter       - Element Selector
 * @param  {HTMLElement} context    - The parent to find the selector in
 * @return {NodeList}
 */
$e.prototype.byCss = function (parameter, context) {
  return (context || document).querySelectorAll(parameter);
};


$e.prototype.selectors = {};

/**
 * Get an element by using getElementsByClassName
 * @param  {String} param   - Element Selector
 * @return {HTMLCollection}
 */
$e.prototype.selectors[/^\.[\w\-]+$/] = function (param) {
  return document.getElementsByClassName(param.substring(1));
};

/**
 * Get an element by using getElementsByTagName
 * @param  {String} param   - Element Selector
 * @return {HTMLCollection}       [description]
 */
$e.prototype.selectors[/^\w+$/] = function (param) {
  return document.getElementsByTagName(param);
};

/**
 * Get an element by using getElementsByTagName
 * @param  {String} param   - Element Selector
 * @return {HTMLElement}
 */
$e.prototype.selectors[/^\#[\w\-]+$/] = function (param) {
  return document.getElementById(param.substring(1));
};

export default $e;
