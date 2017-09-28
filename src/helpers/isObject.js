/**
 * Checks if item is an object
 * @param obj {Mixed}
 */
const isObject = obj => obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';

export default isObject;
