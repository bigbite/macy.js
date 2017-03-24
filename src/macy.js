import './helpers/NodeListFix';

import $e from './modules/$e';
import calculate from './modules/calculate';
import imagesLoaded from './helpers/imagesLoaded';
import { wait } from './helpers/wait';


const defaults = {
  columns: 4,
  margin: 2,
  trueOrder: true,
  waitForImages: false
};

/**
 * Masonary Factory
 * @param {Object} opts - The configuration object for macy.
 */
let Macy = function (opts = defaults) {
  /**
   * Create instance of macy if not instatiated with new Macy
   */
  if (!(this instanceof Macy)) {
    return new Macy(opts)
  }
  this.options = {};
  Object.assign(this.options, defaults, opts);
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

Macy.init = function (options) {
  console.warn('Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) ')
  return new Macy(options);
}

/**
 * Public method for recalculating image positions when the images have loaded.
 * @param  {Boolean} waitUntilFinish - if true it will not recalculate until all images are finished loading
 * @param  {Boolean} refresh         - If true it will recalculate the entire container instead of just new elements.
 */
Macy.prototype.recalculateOnImageLoad = function (waitUntilFinish = false, refresh = false) {
  let imgs = $e('img', this.container);
  let loadingEvent = this.recalculate.bind(this, refresh, false);
  let finalEvent = this.recalculate.bind(this, refresh, true);

  if (waitUntilFinish) {
    return imagesLoaded(imgs, null, finalEvent);
  }

  loadingEvent();
  return imagesLoaded(imgs, loadingEvent, finalEvent);
}

/**
 * Run a function on every image load or once all images are loaded
 * @param  {Function}  func      - Function to run on image load
 * @param  {Boolean} everyLoad   - If true it will run everytime an image loads
 */
Macy.prototype.runOnImageLoad = function (func, everyLoad = false) {
  let imgs = $e('img', this.container);

  if (everyLoad) {
    return imagesLoaded(imgs, func, func);
  }

  return imagesLoaded(imgs, null, func);
}

/**
 * Recalculates masonory positions
 * @param  {Boolean} refresh - Recalculates All elements within the container
 * @param  {Boolean} loaded  - When true it sets the recalculated elements to be marked as complete
 */
Macy.prototype.recalculate = function (refresh = false, loaded = true) {
  return calculate(this, refresh, loaded);
}

/**
 * Destroys macy instance
 */
Macy.prototype.remove = function () {
  window.removeEventListener('resize', this.resizer);

  this.container.children.forEach((child) => {
    child.removeAttribute('data-macy-complete');
    child.removeAttribute('style');
  });

  this.container.removeAttribute('style');
}

/**
 * ReInitializes the macy instance using the already defined options
 */
Macy.prototype.reInit = function () {
  this.recalculate(true, true);
  window.addEventListener('resize', this.resizer);
}

/**
 * Export Macy
 */
// module.exports = Macy;
export default Macy;
