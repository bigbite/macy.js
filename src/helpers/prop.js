/**
 * Get Element computed style
 * @param  {HTMLElement} element  - Element
 * @param  {String}      property - Property to fetch
 * @return {String}               - Desired Element Property
 */
export default (element, property) => {
  return window.getComputedStyle(element, null).getPropertyValue(property)
}
