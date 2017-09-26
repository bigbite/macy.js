// class Queue {
//
//   constructor (events = false) {
//     this.events = [];
//     this.running = false;
//
//     this.add(events);
//   }
//
//   run () {
//     if (this.events.length > 0 && !this.running) {
//       const fn = this.events.shift();
//       this.running = true;
//       fn();
//       this.running = false;
//
//       this.run();
//     }
//   }
//
//   add (event = false) {
//     if (!event) {
//       return false;
//     }
//
//     if (Array.isArray(event)) {
//       return event.forEach((evt) => this.add(evt));
//     }
//
//     this.events.push(event);
//     this.run();
//   }
//
//   clear () {
//     this.events = [];
//   }
// }

const Queue = function (events = false) {
  if (!(this instanceof Queue)) {
    return new Queue(events);
  }

  this.running = false;
  this.events = [];
  this.add(events);
};

Queue.prototype.run = function () {
  if (!this.running && this.events.length > 0) {
    const fn = this.events.shift();
    this.running = true;
    fn();
    this.running = false;

    this.run();
  }
};

Queue.prototype.add = function (event = false) {
  if (!event) {
    return false;
  }

  if (Array.isArray(event)) {
    return event.forEach((evt) => this.add(evt));
  }

  this.events.push(event);
  this.run();
};

Queue.prototype.clear = function () {
  this.events = [];
};

export default Queue;
