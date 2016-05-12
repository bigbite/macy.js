import './helpers/NodeListFix';

import $e from './modules/$e';
import calculate from './modules/calculate';
import imagesLoaded from './helpers/imagesLoaded';
import {wait} from './helpers/wait';

const defaults = {
  columns: 4,
  margin: 2,
  trueOrder: true,
  waitForImages: false
};

let Macy = function (opts) {
  /**
   * Creact instance of macy if not instatiated with new Macy
   */
  if (!(this instanceof Macy)) {
    return new Macy(opts)
  }
  this.options = Object.assign(defaults, opts) || defaults;
  // this.options = opts;
  this.container = $e(opts.container);

  // Checks if container element exists
  if (this.container instanceof $e || !this.container) {
    return opts.debug ? console.error('Error: Container not found') : false;
  }

  // Remove container selector from the options
  delete this.options.container;

  if (this.container.length) {
    this.container = this.container[0];
  }

  this.container.style.position = 'relative';
  this.rows = [];

  let loadingEvent = this.recalculate.bind(this, false, false);
  let finishedLoading = this.recalculate.bind(this, true, true);

  let imgs = $e('img', this.container);

  this.resizer = wait(() => {
    finishedLoading();
  }, 100);

  window.addEventListener('resize', this.resizer);

  if (opts.waitForImages) {
    return imagesLoaded(imgs, null, finishedLoading);
  }

  this.recalculate(true, false);
  imagesLoaded(imgs, loadingEvent, finishedLoading);
}

Macy.prototype.recalculateOnImageLoad = function (waitUntilFinish = false, refresh = false) {
  let imgs = $e('img', this.container);
  let loadingEvent = this.recalculate.bind(this, false, false);
  let finalEvent = this.recalculate.bind(this, false, true);

  if (waitUntilFinish) {
    return imagesLoaded(imgs, null, finalEvent);
  }

  loadingEvent();
  return imagesLoaded(imgs, loadingEvent, finalEvent);
}

Macy.prototype.runOnImageLoad = function (func, everyLoad = false) {
  let imgs = $e('img', this.container);

  if (everyLoad) {
    return imagesLoaded(imgs, func, func);
  }

  return imagesLoaded(imgs, null, func);
}

Macy.prototype.recalculate = function (refresh = false, loaded = true) {
  return calculate(this, refresh, loaded);
}

Macy.prototype.remove = function () {
  window.removeEventListener('resize', this.resizer);

  this.container.children.forEach((child) => {
    child.removeAttribute('data-macy-complete');
    child.removeAttribute('style');
  });

  this.container.removeAttribute('style');
}

module.exports = Macy;
