let methods = Object.getOwnPropertyNames(Array.prototype);

methods.forEach((methodName) => {
  if (methodName !== 'length') {
    NodeList.prototype[methodName] = Array.prototype[methodName];
    HTMLCollection.prototype[methodName] = Array.prototype[methodName];
  }
});
