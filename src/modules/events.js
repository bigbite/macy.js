const EventManager = function (instance = false) {
  if (!(this instanceof EventManager)) {
    return new EventManager(instance);
  }

  this.events = {};
  this.instance = instance;
};

EventManager.prototype.on = function (key = false, func = false) {
  if (!key || !func) {
    return false;
  }

  if (!Array.isArray(this.events[key])) {
    this.events[key] = [];
  }

  return this.events[key].push(func);
};

EventManager.prototype.emit = function (key = false) {
  if (!key || !Array.isArray(this.events[key])) {
    return false;
  }

  this.events[key].forEach((fn) => fn(this.instance));
};

export default EventManager;
