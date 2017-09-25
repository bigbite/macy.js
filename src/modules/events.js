class EventManager {
  constructor(instance = false) {
    this.events = {};
    this.instance = instance;
  }

  on(key = false, func = false) {
    if (!key || !func) {
      return false;
    }

    if (!Array.isArray(this.events[key])) {
      this.events[key] = [];
    }

    return this.events[key].push(func);
  }

  emit(key = false) {
    if (!key || !Array.isArray(this.events[key])) {
      return false;
    }

    this.events[key].forEach((fn) => fn(this.instance));
  }
}

export default EventManager;
