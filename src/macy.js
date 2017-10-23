import $e from './modules/$e';
import setup from './modules/setup.js'
import calculate from './modules/calculate';
import { imagesLoadedNew } from './helpers/imagesLoaded';
import scopeShim from './helpers/scopeshim';

import foreach from './helpers/foreach';


const defaults = {
  columns: 4,
  margin: 2,
  trueOrder: false,
  waitForImages: false,
  useImageLoader: true,
  breakAt: {},
  useOwnImageLoader: false,
  onInit: false,
};

scopeShim();

/**
 * Masonary Factory
 * @param {Object} opts - The configuration object for macy.
 */
const Macy = function (opts = defaults) {
  /**
   * Create instance of macy if not instantiated with new Macy
   */
  if (!(this instanceof Macy)) {
    return new Macy(opts)
  }

  this.options = {};
  Object.assign(this.options, defaults, opts);

  setup(this);
};


Macy.init = function (options) {
  console.warn('Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) ');
  return new Macy(options);
};

/**
 * Public method for recalculating image positions when the images have loaded.
 * @param  {Boolean} waitUntilFinish - if true it will not recalculate until all images are finished loading
 * @param  {Boolean} refresh         - If true it will recalculate the entire container instead of just new elements.
 */
Macy.prototype.recalculateOnImageLoad = function (waitUntilFinish = false) {
  let imgs = $e('img', this.container);
  return imagesLoadedNew(this, imgs, !waitUntilFinish);
};

/**
 * Run a function on every image load or once all images are loaded
 * @param  {Function}  func      - Function to run on image load
 * @param  {Boolean} everyLoad   - If true it will run everytime an image loads
 */
Macy.prototype.runOnImageLoad = function (func, everyLoad = false) {
  let imgs = $e('img', this.container);
  this.on(this.constants.EVENT_IMAGE_COMPLETE, func);

  if (everyLoad) {
    this.on(this.constants.EVENT_IMAGE_LOAD, func);
  }

  return imagesLoadedNew(this, imgs, everyLoad);
};

/**
 * Recalculates masonory positions
 * @param  {Boolean} refresh - Recalculates All elements within the container
 * @param  {Boolean} loaded  - When true it sets the recalculated elements to be marked as complete
 */
Macy.prototype.recalculate = function (refresh = false, loaded = true) {
  if (loaded) {
    this.queue.clear();
  }

  return this.queue.add(() => calculate(this, refresh, loaded));
};

/**
 * Destroys macy instance
 */
Macy.prototype.remove = function () {
  window.removeEventListener('resize', this.resizer);

  foreach(this.container.children, (child) => {
    child.removeAttribute('data-macy-complete');
    child.removeAttribute('style');
  });

  this.container.removeAttribute('style');
};

/**
 * ReInitializes the macy instance using the already defined options
 */
Macy.prototype.reInit = function () {
  this.recalculate(true, true);
  this.emit(this.constants.EVENT_INITIALIZED);
  window.addEventListener('resize', this.resizer);
  this.container.style.position = 'relative';
};

/**
 * Event listener for macy events
 * @param key {String} - Event name to listen to
 * @param func {Function} - Function to be called when event happens
 */
Macy.prototype.on = function (key, func) {
  this.events.on(key, func);
};

/**
 * Emit an event to macy.
 * @param key {String} - Event name to listen to
 * @param data {Object} - Extra data to be passed to the event object that is passed to the event listener.
 */
Macy.prototype.emit = function (key, data) {
  this.events.emit(key, data);
};

/**
 * Macy constants
 * @type {{EVENT_INITIALIZED: string, EVENT_RECALCULATED: string, EVENT_IMAGE_LOAD: string, EVENT_IMAGE_ERROR: string, EVENT_IMAGE_COMPLETE: string, EVENT_RESIZE: string}}
 */
Macy.constants = {
  EVENT_INITIALIZED: 'macy.initialized',
  EVENT_RECALCULATED: 'macy.recalculated',
  EVENT_IMAGE_LOAD: 'macy.image.load',
  EVENT_IMAGE_ERROR: 'macy.image.error',
  EVENT_IMAGE_COMPLETE: 'macy.images.complete',
  EVENT_RESIZE: 'macy.resize',
};

Macy.prototype.constants = Macy.constants;

/**
 * Export Macy
 */
// module.exports = Macy;
export default Macy;
