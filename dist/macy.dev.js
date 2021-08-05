'use strict';

/**
 * Element Factory
 * @param  {String} parameter       - Element Selector
 * @param  {HTMLElement} context    - The parent to find the selector in
 * @return {HTMLElement/HTMLCollection}
 */
const $e = function (parameter, context) {
  if (!(this instanceof $e)) {
    return new $e(parameter, context);
  }

  if (parameter && parameter.nodeName) {
    return parameter;
  }

  // Allow for spaces before or after
  parameter = parameter.replace(/^\s*/, '').replace(/\s*$/, '');

  if (context) {
    return this.byCss(parameter, context);
  }

  for (var key in this.selectors) {
    // Reusing it to save space
    context = key.split('/');
    if ((new RegExp(context[1], context[2])).test(parameter)) {
      return this.selectors[key](parameter);
    }
  }

  return this.byCss(parameter);
};

/**
 * Get an element by using querySelectorAll
 * @param  {String} parameter       - Element Selector
 * @param  {HTMLElement} context    - The parent to find the selector in
 * @return {NodeList}
 */
$e.prototype.byCss = function (parameter, context) {
  return (context || document).querySelectorAll(parameter);
};


$e.prototype.selectors = {};

/**
 * Get an element by using getElementsByClassName
 * @param  {String} param   - Element Selector
 * @return {HTMLCollection}
 */
$e.prototype.selectors[/^\.[\w\-]+$/] = function (param) {
  return document.getElementsByClassName(param.substring(1));
};

/**
 * Get an element by using getElementsByTagName
 * @param  {String} param   - Element Selector
 * @return {HTMLCollection}       [description]
 */
$e.prototype.selectors[/^\w+$/] = function (param) {
  return document.getElementsByTagName(param);
};

/**
 * Get an element by using getElementsByTagName
 * @param  {String} param   - Element Selector
 * @return {HTMLElement}
 */
$e.prototype.selectors[/^\#[\w\-]+$/] = function (param) {
  return document.getElementById(param.substring(1));
};

/**
 * Waits until wait stops being called before calling desired function
 * @param  {Function} func  - Function to run after the Wait stops being called
 * @param  {Integer}  delta - Time to wait after wait call to run the function
 * @return {Function}       - function that runs the desired function after it has stopped being called
 */
function wait (func, delta) {
  let to;

  return function () {
    if (to) {
      clearTimeout(to);
    }

    to = setTimeout(func, delta);
  };
}

const foreach = (iterable, callback) => {
  let i = iterable.length, len = i;

  while (i--) {
    callback(iterable[len - i - 1]);
  }
};

function map (iterable, callback) {
  let i = iterable.length, len = i;
  let returns = [];


  while (i--) {
    returns.push(callback(iterable[len - i - 1]));
  }

  return returns;
}

/**
 * The queue function allows to for recalculate to run one at a time to avoid conflicts.
 * @param events {Mixed} a single function or an array of functions
 * @constructor
 */
const Queue = function (events = false) {
  this.running = false;
  this.events = [];
  this.add(events);
};

/**
 * Run all the events one after the other.
 */
Queue.prototype.run = function () {
  if (!this.running && this.events.length > 0) {
    const fn = this.events.shift();
    this.running = true;
    fn();
    this.running = false;

    this.run();
  }
};

/**
 * Add a event to the queue and try to run the que
 * @param event {Mixed} a single function or an array of functions
 */
Queue.prototype.add = function (event = false) {
  if (!event) {
    return false;
  }

  if (Array.isArray(event)) {
    return foreach(event, (evt) => this.add(evt));
  }

  this.events.push(event);
  this.run();
};

/**
 * Clear all events from the queue
 */
Queue.prototype.clear = function () {
  this.events = [];
};

/**
 * Event object that will be passed to callbacks
 * @param instance {Macy} - Macy instance
 * @param data {Object}
 * @returns {Event}
 * @constructor
 */
const Event = function (instance, data = {}) {
  this.instance = instance;
  this.data = data;

  return this;
};

/**
 * Event manager
 * @param instance {Function/boolean}
 * @constructor
 */
const EventManager = function (instance = false) {
  this.events = {};
  this.instance = instance;
};

/**
 * Event listener for macy events
 * @param key {String/boolean} - Event name to listen to
 * @param func {Function/boolean} - Function to be called when event happens
 */
EventManager.prototype.on = function (key = false, func = false) {
  if (!key || !func) {
    return false;
  }

  if (!Array.isArray(this.events[key])) {
    this.events[key] = [];
  }

  return this.events[key].push(func);
};

/**
 * Emit an event to macy.
 * @param key {String/boolean} - Event name to listen to
 * @param data {Object} - Extra data to be passed to the event object that is passed to the event listener.
 */
EventManager.prototype.emit = function (key = false, data = {}) {
  if (!key || !Array.isArray(this.events[key])) {
    return false;
  }

  const evt = new Event(this.instance, data);
  foreach(this.events[key], (fn) => fn(evt));
};

/**
 * Checks if an image has loaded by checking the height and width
 * @param img {Node} - Image element
 */
const imageHasLoaded = (img) => !('naturalHeight' in img && img.naturalHeight + img.naturalWidth === 0) || img.width + img.height !== 0;

/**
 * Returns a promise the emits events to macy context if loaded/errors
 * @param ctx {Object} - Macy instance
 * @param image {Node} - Image Element
 * @param emitOnLoad {Boolean} - Should promise fire image load event
 * @returns {Promise}
 */
const promise = (ctx, image, emitOnLoad = false) => {
  return new Promise((resolve, reject) => {
    if (image.complete) {

      if (!imageHasLoaded(image)) {
        return reject(image);
      }

      return resolve(image);
    }

    image.addEventListener('load', () => {
      if (imageHasLoaded(image)) {
        return resolve(image);
      }

      return reject(image);
    });

    image.addEventListener('error', () => {
      return reject(image);
    });
  }).then((img) => {
    if (emitOnLoad) {
      ctx.emit(ctx.constants.EVENT_IMAGE_LOAD, { img });
    }
  }).catch((img) => ctx.emit(ctx.constants.EVENT_IMAGE_ERROR, { img }));
};

/**
 * Returns an array of promises for images loaded
 * @param ctx {Object} - Macy instance
 * @param images {NodeList}
 * @param emitOnLoad {Boolean} - Should promise fire image load event
 * @returns {Array}
 */
const getImagePromises = (ctx, images, emitOnLoad = false) => {
  return map(images, (image) => promise(ctx, image, emitOnLoad));
};

/**
 * Returns a promise that emits an images complete event when all images are loaded.
 * @param ctx {Object} - Macy instance
 * @param images {NodeList}
 * @param emitOnLoad {Boolean} - Should promise fire image load event
 */
const imageLoaderPromise = (ctx, images, emitOnLoad = false) => Promise.all(getImagePromises(ctx, images, emitOnLoad)).then(() => {
  ctx.emit(ctx.constants.EVENT_IMAGE_COMPLETE);
});

/**
 * Sets up the image loading promise.
 * @param ctx {Object} - Macy instance
 * @param imgs {NodeList}
 * @param during {Boolean} - Should promise fire image load event
 */
function imagesLoadedNew (ctx, imgs, during = false) {
  if (!!window.Promise) {
    return imageLoaderPromise(ctx, imgs, during);
  }

  ctx.recalculate(true, true);
}

/**
 * create a resize event that adds recalculate to the event queue;
 * @param ctx {Object} - Macy instance
 */
const createResizeEvent = (ctx) => wait(() => {
  ctx.emit(ctx.constants.EVENT_RESIZE);
  ctx.queue.add(() => ctx.recalculate(true, true));
}, 100);

/**
 * Setup the containing element with the correct styles and attaches it to the macy instance
 * @param ctx {Object} - Macy instance
 */
const setupContainer = (ctx) => {
  // this.options = opts;
  ctx.container = $e(ctx.options.container);

  // Checks if container element exists
  if (ctx.container instanceof $e || !ctx.container) {
    return ctx.options.debug ? console.error('Error: Container not found') : false;
  }


  if (ctx.container.length) {
    ctx.container = ctx.container[0];
  }

  // Set container options selector to container element
  ctx.options.container = ctx.container;

  ctx.container.style.position = 'relative';
};

/**
 * Generates the basic state objects for macy to run
 * @param ctx {Object} - Macy instance
 */
const setupState = (ctx) => {
  ctx.queue = new Queue();
  ctx.events = new EventManager(ctx);
  ctx.rows = [];
  ctx.resizer = createResizeEvent(ctx);
};

/**
 * Sets up event listeners for resize and image loading (if required)
 * @param ctx {Object} - Macy instance
 */
const setupEventListeners = (ctx) => {
  let imgs = $e('img', ctx.container);

  window.addEventListener('resize', ctx.resizer);
  ctx.on(ctx.constants.EVENT_IMAGE_LOAD, () => ctx.recalculate(false, false));
  ctx.on(ctx.constants.EVENT_IMAGE_COMPLETE, () => ctx.recalculate(true, true));

  if (!ctx.options.useOwnImageLoader) {
    imagesLoadedNew(ctx, imgs, !ctx.options.waitForImages);
  }

  ctx.emit(ctx.constants.EVENT_INITIALIZED);
};

const setup = (ctx) => {
  setupContainer(ctx);
  setupState(ctx);
  setupEventListeners(ctx);
};

/**
 * Checks if item is an object
 * @param obj {Mixed}
 */
const isObject = obj => obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';

/**
 * Replaces responsiveOptions with temporary options where applicable.
 * @param tempOpts
 * @param responsiveOptions
 */
const replaceOptionsResponsively = (tempOpts, responsiveOptions) => {
  if (!isObject(tempOpts)) {
    responsiveOptions.columns = tempOpts;
  }

  if (isObject(tempOpts) && tempOpts.columns) {
    responsiveOptions.columns = tempOpts.columns;
  }

  if (isObject(tempOpts) && tempOpts.margin && !isObject(tempOpts.margin)) {
    responsiveOptions.margin = {
      x: tempOpts.margin,
      y: tempOpts.margin
    };
  }

  if (isObject(tempOpts) && tempOpts.margin && isObject(tempOpts.margin) && tempOpts.margin.x) {
    responsiveOptions.margin.x = tempOpts.margin.x;
  }

  if (isObject(tempOpts) && tempOpts.margin && isObject(tempOpts.margin) && tempOpts.margin.y) {
    responsiveOptions.margin.y = tempOpts.margin.y;
  }
};

/**
 * Return the current spacing options based on document size, in a mobile first manner.
 * @param  {Object} args - This passes the macy instance options, responsiveOptions object, the width keys and document width.
 * @return {Object}         - Object containing the current spacing options
 */
function getOptionsAsMobileFirst ({ options, responsiveOptions, keys, docWidth }) {
  let tempOpts;

  for (let i = 0; i < keys.length; i++) {
    let widths = parseInt(keys[i], 10);

    if (docWidth >= widths) {
      tempOpts = options.breakAt[widths];
      replaceOptionsResponsively(tempOpts, responsiveOptions);
    }
  }

  return responsiveOptions;
}

/**
 * Return the current spacing options based on document size, in a desktop first manner.
 * @param  {Object} args - This passes the macy instance options, responsiveOptions object, the width keys and document width.
 * @return {Object}         - Object containing the current spacing options
 */
function getOptionsAsDesktopFirst ({ options, responsiveOptions, keys, docWidth }) {
  let tempOpts;

  for (let i = keys.length - 1; i >= 0; i--) {
    let widths = parseInt(keys[i], 10);

    if (docWidth <= widths) {
      tempOpts = options.breakAt[widths];
      replaceOptionsResponsively(tempOpts, responsiveOptions);
    }
  }

  return responsiveOptions;
}

/**
 * Return the current spacing options based on document size.
 * @param  {Object} options - Macy instance's options
 * @return {Object}         - Object containing the current spacing options
 */
function getResponsiveOptions (options) {
  let docWidth = options.useContainerForBreakpoints ? options.container.clientWidth : window.innerWidth;
  let responsiveOptions = {
    columns: options.columns,
  };

  if (!isObject(options.margin)) {
    responsiveOptions.margin = {
      x: options.margin,
      y: options.margin
    };
  } else {
    responsiveOptions.margin = {
      x: options.margin.x,
      y: options.margin.y
    };
  }

  let keys = Object.keys(options.breakAt);

  if (options.mobileFirst) {
    return getOptionsAsMobileFirst({ options, responsiveOptions, keys, docWidth });
  }

  return getOptionsAsDesktopFirst({ options, responsiveOptions, keys, docWidth });
}

/**
 * Return the current number of columns macy should be
 * @param  {Object} options - Macy instance's options
 * @return {Integer}        - Number of columns
 */
function getCurrentColumns (options) {
  let noOfColumns = getResponsiveOptions(options).columns;
  return noOfColumns;
}

/**
 * Return the current margin dimensions macy should use
 * @param  {Object} options - Macy instance's options
 * @return {Object}         - Object containing x & y margins
 */
function getCurrentMargin (options) {
  let margin = getResponsiveOptions(options).margin;
  return margin;
}

/**
 * Get the width of each column based on the number of columns
 * @param  {Object} options           - Macy instance's options
 * @param  {Boolean} marginsIncluded  - Include margins into the calculations
 * @return {String}                   - The correct number css style for column width
 */
function getWidths (options, marginsIncluded = true) {
  let noOfColumns = getCurrentColumns(options);
  let margins = getCurrentMargin(options).x;
  let width = 100 / noOfColumns;

  if (!marginsIncluded) {
    return width;
  }

  if (noOfColumns === 1) {
    return '100%';
  }

  let unit = 'px';

  if (typeof margins === 'string') {
    let tempBase = parseFloat(margins);
    unit = margins.replace(tempBase, '');
    margins = tempBase;
  }

  margins = (noOfColumns - 1) * margins / noOfColumns;

  if (unit === '%') {
    return `${width - margins}%`;
  }

  return `calc(${width}% - ${margins}${unit})`;
}
/**
 * Get the left position based on which column and column width
 * @param  {Macy}    ctx  - Macy instance
 * @param  {Integer} col  - Current Number of Columns
 * @return {String}       - The correct number css style for column position
 */
function getLeftPosition (ctx, col) {
  let noOfColumns = getCurrentColumns(ctx.options);
  let totalLeft = 0;
  let margin, str, baseMargin;

  col++;

  if (col === 1) {
    return 0;
  }

  baseMargin = getCurrentMargin(ctx.options).x;
  let unit = 'px';

  if (typeof baseMargin === 'string') {
    let tempBase = parseFloat(baseMargin, 10);
    unit = baseMargin.replace(tempBase, '');
    baseMargin = tempBase;
  }


  margin = (baseMargin - (noOfColumns - 1) * baseMargin / noOfColumns) * (col - 1);
  totalLeft += getWidths(ctx.options, false) * (col - 1);
  if (unit === '%') {
    str = `${totalLeft + margin}%`;
  } else {
    str = `calc(${totalLeft}% + ${margin}${unit})`;
  }

  return str;
}

/**
 * Sets the containers height based on the last item in the container
 * @param {Macy} ctx  - Macy instance
 */
function setContainerHeight (ctx) {
  let largest = 0;
  let {container, rows} = ctx;

  foreach(rows, (row) => {
    largest = row > largest ? row : largest;
  });

  container.style.height = `${largest}px`;
}

/**
 * Get Element computed style
 * @param  {HTMLElement} element  - Element
 * @param  {String}      property - Property to fetch
 * @return {String}               - Desired Element Property
 */
var prop = (element, property) => {
  return window.getComputedStyle(element, null).getPropertyValue(property)
};

/**
 * Sets up the required data for the shuffle and sort method
 * @param  {Macy}     ctx     - Macy Instance
 * @param  {Integer}  cols    - Number of columns
 * @param  {Boolean} refresh  - Should columns and rows be reset
 */
const setUpRows = (ctx, cols, refresh = false) => {
  if (!ctx.lastcol) {
    ctx.lastcol = 0;
  }

  if (ctx.rows.length < 1) {
    refresh = true;
  }

  // Reset rows
  if (refresh) {
    ctx.rows = [];
    ctx.cols = [];
    ctx.lastcol = 0;

    for (var i = cols - 1; i >= 0; i--) {
      ctx.rows[i] = 0;
      ctx.cols[i] = getLeftPosition(ctx, i);
    }

    return;
  }

  if (ctx.tmpRows) {
    ctx.rows = [];

    for (var i = cols - 1; i >= 0; i--) {
      ctx.rows[i] = ctx.tmpRows[i];
    }
    return
  }

  ctx.tmpRows = [];
  for (var i = cols - 1; i >= 0; i--) {
    ctx.tmpRows[i] = ctx.rows[i];
  }
};

/**
 * A Sorting method when trueOrder = false
 * @param  {Macy}      ctx              - Macy Instance
 * @param  {NodeList}  $eles            - Element List to sort
 * @param  {Boolean}   refresh          - Show all columns and rows be refreshed and recalculated
 * @param  {Boolean}   markasComplete   - Mark elements as complete
 */
function shuffle (ctx, $eles, refresh = false, markasComplete = true) {
  let cols = getCurrentColumns(ctx.options);
  let margin = getCurrentMargin(ctx.options).y;
  setUpRows(ctx, cols, refresh);

  foreach($eles, (ele) => {
    let smallest = 0;
    let eleHeight = parseInt(ele.offsetHeight, 10);

    if (cols === 1) {
      ele.removeAttribute('style');
      return;
    }

    if (isNaN(eleHeight)) return;

    ctx.rows.forEach((v, k) => {
      if (v < ctx.rows[smallest]) {
        smallest = k;
      }
    });

    ele.style.position = 'absolute';
    ele.style.top = `${ctx.rows[smallest]}px`;
    ele.style[ctx.options.rtl ? 'right' : 'left'] = `${ctx.cols[smallest]}`;

    ctx.rows[smallest] += !isNaN(eleHeight) ? eleHeight + margin : 0;

    if (markasComplete) {
      ele.dataset.macyComplete = 1;
    }
  });

  if (markasComplete) {
    ctx.tmpRows = null;
  }

  if (cols === 1) {
    ctx.container.style.height = 'auto';
  } else {
    setContainerHeight(ctx);
  }
}

/**
 * A Sorting method when trueOrder = true
 * @param  {Macy}      ctx              - Macy Instance
 * @param  {NodeList}  $eles            - Element List to sort
 * @param  {Boolean}   refresh          - Show all columns and rows be refreshed and recalculated
 * @param  {Boolean}   markasComplete   - Mark elements as complete
 */
function sort (ctx, $eles, refresh = false, markasComplete = true) {
  let cols = getCurrentColumns(ctx.options);
  let margin = getCurrentMargin(ctx.options).y;
  setUpRows(ctx, cols, refresh);

  foreach($eles, (ele) => {

    if (ctx.lastcol === cols) {
      ctx.lastcol = 0;
    }

    if (cols === 1) {
      ele.removeAttribute('style');
      return;
    }

    let eleHeight = prop(ele, 'height');
    eleHeight = parseInt(ele.offsetHeight, 10);

    if (isNaN(eleHeight)) return;
    ele.style.position = 'absolute';
    ele.style.top = `${ctx.rows[ctx.lastcol]}px`;
    ele.style[ctx.options.rtl ? 'right' : 'left'] = `${ctx.cols[ctx.lastcol]}`;
    ctx.rows[ctx.lastcol] += !isNaN(eleHeight) ? eleHeight + margin : 0;
    ctx.lastcol += 1;

    if (markasComplete) {
      ele.dataset.macyComplete = 1;
    }
  });

  if (markasComplete) {
    ctx.tmpRows = null;
  }

  if (cols === 1) {
    ctx.container.style.height = 'auto';
  } else {
    setContainerHeight(ctx);
  }
}

/**
 * Calculates the column widths and positions dependant on options.
 * @param  {Macy}  ctx       - Macy instance
 * @param  {Boolean} refresh - Should calculate recalculate all elements
 * @param  {Boolean} loaded  - Should all elements be marked as complete
 */
const calculate = (ctx, refresh = false, loaded = true) => {
  let children = refresh ? ctx.container.children : $e(':scope > *:not([data-macy-complete="1"])', ctx.container);

  // Filter out hidden children.
  children = Array.from(children).filter(child => child.offsetParent !== null);

  let eleWidth = getWidths(ctx.options);

  foreach(children, (child) => {
    if (refresh) {
      child.dataset.macyComplete = 0;
    }
    child.style.width = eleWidth;
  });

  if (ctx.options.trueOrder) {
    sort(ctx, children, refresh, loaded);
    return ctx.emit(ctx.constants.EVENT_RECALCULATED);//cols.sort(ctx, children, refresh, loaded);
  }

  shuffle(ctx, children, refresh, loaded);
  return ctx.emit(ctx.constants.EVENT_RECALCULATED); //cols.shuffle(ctx, children, refresh, loaded);
};

/**
 * Polyfill from https://github.com/jonathantneal/element-qsa-scope
 */
/* eslint-disable */
const init = () => {
  try {
    // test for scope support
    document.createElement('a').querySelector(':scope *');
  } catch (error) {
    (function() {
      // scope regex
      var scope = /:scope\b/gi;

      // polyfilled <Element>.querySelector
      var querySelectorWithScope = polyfill(Element.prototype.querySelector);

      Element.prototype.querySelector = function querySelector(selectors) {
        return querySelectorWithScope.apply(this, arguments);
      };

      // polyfilled <Element>.querySelectorAll
      var querySelectorAllWithScope = polyfill(Element.prototype.querySelectorAll);

      Element.prototype.querySelectorAll = function querySelectorAll(selectors) {
        return querySelectorAllWithScope.apply(this, arguments);
      };

      function polyfill(originalQuerySelector) {
        return function(selectors) {
          // whether selectors contain :scope
          var hasScope = selectors && scope.test(selectors);

          if (hasScope) {
            // element id
            var id = this.getAttribute('id');

            if (!id) {
              // update id if falsey or missing
              this.id = 'q' + Math.floor(Math.random() * 9000000) + 1000000;
            }

            // modify arguments
            arguments[0] = selectors.replace(scope, '#' + this.id);

            // result of the original query selector
            var elementOrNodeList = originalQuerySelector.apply(this, arguments);

            if (id === null) {
              // remove id if missing
              this.removeAttribute('id');
            } else if (!id) {
              // restore id if falsey
              this.id = id;
            }

            return elementOrNodeList;
          } else {
            // result of the original query sleector
            return originalQuerySelector.apply(this, arguments);
          }
        };
      }
    })();
  }
};

const isSupported = () => !!window.Promise;

if (!Array.from) {
  Array.from=n=>{let i=0,a=[];for (;i<n.length;)a.push(n[i++]);return a;};
}


const defaults = {
  columns: 4,
  margin: 2,
  trueOrder: false,
  waitForImages: false,
  useImageLoader: true,
  breakAt: {},
  useOwnImageLoader: false,
  onInit: false,
  cancelLegacy: false,
  useContainerForBreakpoints: false,
  rtl: document.documentElement.getAttribute('dir') === 'rtl',
};

init();

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

  if (this.options.cancelLegacy && !isSupported()) {
    return;
  }

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

module.exports = Macy;
