export default (element, property) => {
  return window.getComputedStyle(element, null).getPropertyValue(property)
}
