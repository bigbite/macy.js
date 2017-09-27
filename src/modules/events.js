import foreach from '../helpers/foreach';

const EventManager = function (instance = false) {
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

  foreach(this.events[key], (fn) => fn(this.instance));
};

export default EventManager;
