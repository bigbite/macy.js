/* Macy.js - v2.3.0 */
/**
 * Element Factory
 * @param  {String} parameter       - Element Selector
 * @param  {HTMLElement} context    - The parent to find the selector in
 * @return {HTMLElement/HTMLCollection}
 */
var $e = function $e(parameter, context) {
  if (!(this instanceof $e)) {
    return new $e(parameter, context);
  }

  // Allow for spaces before or after
  parameter = parameter.replace(/^\s*/, '').replace(/\s*$/, '');

  if (context) {
    return this.byCss(parameter, context);
  }

  for (var key in this.selectors) {
    // Reusing it to save space
    context = key.split('/');
    if (new RegExp(context[1], context[2]).test(parameter)) {
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
function wait(func, delta) {
  var to = void 0;

  return function () {
    if (to) {
      clearTimeout(to);
    }

    to = setTimeout(func, delta);
  };
}

var foreach = function foreach(iterable, callback) {
  var i = iterable.length,
      len = i;

  while (i--) {
    callback(iterable[len - i - 1]);
  }
};

function map(iterable, callback) {
  var i = iterable.length,
      len = i;
  var returns = [];

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
var Queue = function Queue() {
  var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  this.running = false;
  this.events = [];
  this.add(events);
};

/**
 * Run all the events one after the other.
 */
Queue.prototype.run = function () {
  if (!this.running && this.events.length > 0) {
    var fn = this.events.shift();
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
Queue.prototype.add = function () {
  var _this = this;

  var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (!event) {
    return false;
  }

  if (Array.isArray(event)) {
    return foreach(event, function (evt) {
      return _this.add(evt);
    });
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
var Event = function Event(instance) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  this.instance = instance;
  this.data = data;

  return this;
};

/**
 * Event manager
 * @param instance {Function/boolean}
 * @constructor
 */
var EventManager = function EventManager() {
  var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  this.events = {};
  this.instance = instance;
};

/**
 * Event listener for macy events
 * @param key {String/boolean} - Event name to listen to
 * @param func {Function/boolean} - Function to be called when event happens
 */
EventManager.prototype.on = function () {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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
EventManager.prototype.emit = function () {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!key || !Array.isArray(this.events[key])) {
    return false;
  }

  var evt = new Event(this.instance, data);
  foreach(this.events[key], function (fn) {
    return fn(evt);
  });
};

/**
 * Checks if an image has loaded by checking the height and width
 * @param img {Node} - Image element
 */
var imageHasLoaded = function imageHasLoaded(img) {
  return !('naturalHeight' in img && img.naturalHeight + img.naturalWidth === 0) || img.width + img.height !== 0;
};

/**
 * Returns a promise the emits events to macy context if loaded/errors
 * @param ctx {Object} - Macy instance
 * @param image {Node} - Image Element
 * @param emitOnLoad {Boolean} - Should promise fire image load event
 * @returns {Promise}
 */
var promise = function promise(ctx, image) {
  var emitOnLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  return new Promise(function (resolve, reject) {
    if (image.complete) {

      if (!imageHasLoaded(image)) {
        return reject(image);
      }

      return resolve(image);
    }

    image.addEventListener('load', function () {
      if (imageHasLoaded(image)) {
        return resolve(image);
      }

      return reject(image);
    });

    image.addEventListener('error', function () {
      return reject(image);
    });
  }).then(function (img) {
    if (emitOnLoad) {
      ctx.emit(ctx.constants.EVENT_IMAGE_LOAD, { img: img });
    }
  }).catch(function (img) {
    return ctx.emit(ctx.constants.EVENT_IMAGE_ERROR, { img: img });
  });
};

/**
 * Returns an array of promises for images loaded
 * @param ctx {Object} - Macy instance
 * @param images {NodeList}
 * @param emitOnLoad {Boolean} - Should promise fire image load event
 * @returns {Array}
 */
var getImagePromises = function getImagePromises(ctx, images) {
  var emitOnLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  return map(images, function (image) {
    return promise(ctx, image, emitOnLoad);
  });
};

/**
 * Returns a promise that emits an images complete event when all images are loaded.
 * @param ctx {Object} - Macy instance
 * @param images {NodeList}
 * @param emitOnLoad {Boolean} - Should promise fire image load event
 */
var imageLoaderPromise = function imageLoaderPromise(ctx, images) {
  var emitOnLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return Promise.all(getImagePromises(ctx, images, emitOnLoad)).then(function () {
    ctx.emit(ctx.constants.EVENT_IMAGE_COMPLETE);
  });
};

/**
 * Sets up the image loading promise.
 * @param ctx {Object} - Macy instance
 * @param imgs {NodeList}
 * @param during {Boolean} - Should promise fire image load event
 */
function imagesLoadedNew(ctx, imgs) {
  var during = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  imageLoaderPromise(ctx, imgs, during);
}

/**
 * create a resize event that adds recalculate to the event queue;
 * @param ctx {Object} - Macy instance
 */
var createResizeEvent = function createResizeEvent(ctx) {
  return wait(function () {
    ctx.emit(ctx.constants.EVENT_RESIZE);
    ctx.queue.add(function () {
      return ctx.recalculate(true, true);
    });
  }, 100);
};

/**
 * Setup the containing element with the correct styles and attaches it to the macy instance
 * @param ctx {Object} - Macy instance
 */
var setupContainer = function setupContainer(ctx) {
  // this.options = opts;
  ctx.container = $e(ctx.options.container);

  // Checks if container element exists
  if (ctx.container instanceof $e || !ctx.container) {
    return ctx.options.debug ? console.error('Error: Container not found') : false;
  }

  // Remove container selector from the options
  delete ctx.options.container;

  if (ctx.container.length) {
    ctx.container = ctx.container[0];
  }

  ctx.container.style.position = 'relative';
};

/**
 * Generates the basic state objects for macy to run
 * @param ctx {Object} - Macy instance
 */
var setupState = function setupState(ctx) {
  ctx.queue = new Queue();
  ctx.events = new EventManager(ctx);
  ctx.rows = [];
  ctx.resizer = createResizeEvent(ctx);
};

/**
 * Sets up event listeners for resize and image loading (if required)
 * @param ctx {Object} - Macy instance
 */
var setupEventListeners = function setupEventListeners(ctx) {
  var imgs = $e('img', ctx.container);

  window.addEventListener('resize', ctx.resizer);
  ctx.on(ctx.constants.EVENT_IMAGE_LOAD, function () {
    return ctx.recalculate(false, false);
  });
  ctx.on(ctx.constants.EVENT_IMAGE_COMPLETE, function () {
    return ctx.recalculate(true, true);
  });

  if (!ctx.options.useOwnImageLoader) {
    imagesLoadedNew(ctx, imgs, !ctx.options.waitForImages);
  }

  ctx.emit(ctx.constants.EVENT_INITIALIZED);
};

var setup = function setup(ctx) {
  setupContainer(ctx);
  setupState(ctx);
  setupEventListeners(ctx);
};

/**
 * Checks if item is an object
 * @param obj {Mixed}
 */
var isObject = function isObject(obj) {
  return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
};

/**
 * Replaces responsiveOptions with temporary options where applicable.
 * @param tempOpts
 * @param responsiveOptions
 */
var replaceOptionsResponsively = function replaceOptionsResponsively(tempOpts, responsiveOptions) {
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
function getOptionsAsMobileFirst(_ref) {
  var options = _ref.options,
      responsiveOptions = _ref.responsiveOptions,
      keys = _ref.keys,
      docWidth = _ref.docWidth;

  var tempOpts = void 0;

  for (var i = 0; i < keys.length; i++) {
    var widths = parseInt(keys[i], 10);

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
function getOptionsAsDesktopFirst(_ref2) {
  var options = _ref2.options,
      responsiveOptions = _ref2.responsiveOptions,
      keys = _ref2.keys,
      docWidth = _ref2.docWidth;

  var tempOpts = void 0;

  for (var i = keys.length - 1; i >= 0; i--) {
    var widths = parseInt(keys[i], 10);

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
function getResponsiveOptions(options) {
  var docWidth = document.body.clientWidth;
  var responsiveOptions = {
    columns: options.columns
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

  var keys = Object.keys(options.breakAt);

  if (options.mobileFirst) {
    return getOptionsAsMobileFirst({ options: options, responsiveOptions: responsiveOptions, keys: keys, docWidth: docWidth });
  }

  return getOptionsAsDesktopFirst({ options: options, responsiveOptions: responsiveOptions, keys: keys, docWidth: docWidth });
}

/**
 * Return the current number of columns macy should be
 * @param  {Object} options - Macy instance's options
 * @return {Integer}        - Number of columns
 */
function getCurrentColumns(options) {
  var noOfColumns = getResponsiveOptions(options).columns;
  return noOfColumns;
}

/**
 * Return the current margin dimensions macy should use
 * @param  {Object} options - Macy instance's options
 * @return {Object}         - Object containing x & y margins
 */
function getCurrentMargin(options) {
  var margin = getResponsiveOptions(options).margin;
  return margin;
}

/**
 * Get the width of each column based on the number of columns
 * @param  {Object} options           - Macy instance's options
 * @param  {Boolean} marginsIncluded  - Include margins into the calculations
 * @return {String}                   - The correct number css style for column width
 */
function getWidths(options) {
  var marginsIncluded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var noOfColumns = getCurrentColumns(options);
  var margins = getCurrentMargin(options).x;
  var width = 100 / noOfColumns;

  if (!marginsIncluded) {
    return width;
  }

  if (noOfColumns === 1) {
    return '100%';
  }

  margins = (noOfColumns - 1) * margins / noOfColumns;
  return 'calc(' + width + '% - ' + margins + 'px)';
}
/**
 * Get the left position based on which column and column width
 * @param  {Macy}    ctx  - Macy instance
 * @param  {Integer} col  - Current Number of Columns
 * @return {String}       - The correct number css style for column position
 */
function getLeftPosition(ctx, col) {
  var noOfColumns = getCurrentColumns(ctx.options);
  var totalLeft = 0;
  var margin = void 0,
      str = void 0,
      baseMargin = void 0;

  col++;

  if (col === 1) {
    return 0;
  }

  baseMargin = getCurrentMargin(ctx.options).x;

  margin = (baseMargin - (noOfColumns - 1) * baseMargin / noOfColumns) * (col - 1);
  totalLeft += getWidths(ctx.options, false) * (col - 1);
  str = 'calc(' + totalLeft + '% + ' + margin + 'px)';

  return str;
}

/**
 * Sets the containers height based on the last item in the container
 * @param {Macy} ctx  - Macy instance
 */
function setContainerHeight(ctx) {
  var largest = 0;
  var container = ctx.container,
      rows = ctx.rows;


  foreach(rows, function (row) {
    largest = row > largest ? row : largest;
  });

  container.style.height = largest + 'px';
}

/**
 * Get Element computed style
 * @param  {HTMLElement} element  - Element
 * @param  {String}      property - Property to fetch
 * @return {String}               - Desired Element Property
 */
var prop = (function (element, property) {
  return window.getComputedStyle(element, null).getPropertyValue(property);
});

/**
 * Sets up the required data for the shuffle and sort method
 * @param  {Macy}     ctx     - Macy Instance
 * @param  {Integer}  cols    - Number of columns
 * @param  {Boolean} refresh  - Should columns and rows be reset
 */
var setUpRows = function setUpRows(ctx, cols) {
  var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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
    return;
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
function shuffle(ctx, $eles) {
  var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var markasComplete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var cols = getCurrentColumns(ctx.options);
  var margin = getCurrentMargin(ctx.options).y;
  setUpRows(ctx, cols, refresh);

  foreach($eles, function (ele) {
    var smallest = 0;
    var eleHeight = parseInt(ele.offsetHeight, 10);

    if (isNaN(eleHeight)) return;

    ctx.rows.forEach(function (v, k) {
      if (v < ctx.rows[smallest]) {
        smallest = k;
      }
    });

    ele.style.position = 'absolute';
    ele.style.top = ctx.rows[smallest] + 'px';
    ele.style.left = '' + ctx.cols[smallest];
    ctx.rows[smallest] += !isNaN(eleHeight) ? eleHeight + margin : 0;

    if (markasComplete) {
      ele.dataset.macyComplete = 1;
    }
  });

  if (markasComplete) {
    ctx.tmpRows = null;
  }

  setContainerHeight(ctx);
}

/**
 * A Sorting method when trueOrder = true
 * @param  {Macy}      ctx              - Macy Instance
 * @param  {NodeList}  $eles            - Element List to sort
 * @param  {Boolean}   refresh          - Show all columns and rows be refreshed and recalculated
 * @param  {Boolean}   markasComplete   - Mark elements as complete
 */
function sort(ctx, $eles) {
  var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var markasComplete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var cols = getCurrentColumns(ctx.options);
  var margin = getCurrentMargin(ctx.options).y;
  setUpRows(ctx, cols, refresh);

  foreach($eles, function (ele) {

    if (ctx.lastcol === cols) {
      ctx.lastcol = 0;
    }

    var eleHeight = prop(ele, 'height');
    eleHeight = parseInt(ele.offsetHeight, 10);

    if (isNaN(eleHeight)) return;
    ele.style.position = 'absolute';
    ele.style.top = ctx.rows[ctx.lastcol] + 'px';
    ele.style.left = '' + ctx.cols[ctx.lastcol];
    ctx.rows[ctx.lastcol] += !isNaN(eleHeight) ? eleHeight + margin : 0;
    ctx.lastcol += 1;

    if (markasComplete) {
      ele.dataset.macyComplete = 1;
    }
  });

  if (markasComplete) {
    ctx.tmpRows = null;
  }

  setContainerHeight(ctx);
}

/**
 * Calculates the column widths and positions dependant on options.
 * @param  {Macy}  ctx       - Macy instance
 * @param  {Boolean} refresh - Should calculate recalculate all elements
 * @param  {Boolean} loaded  - Should all elements be marked as complete
 */
var calculate = function calculate(ctx) {
  var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var loaded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var children = refresh ? ctx.container.children : $e(':scope > *:not([data-macy-complete="1"])', ctx.container);
  var eleWidth = getWidths(ctx.options);

  foreach(children, function (child) {
    if (refresh) {
      child.dataset.macyComplete = 0;
    }
    child.style.width = eleWidth;
  });

  if (ctx.options.trueOrder) {
    sort(ctx, children, refresh, loaded);
    return ctx.emit(ctx.constants.EVENT_RECALCULATED); //cols.sort(ctx, children, refresh, loaded);
  }

  shuffle(ctx, children, refresh, loaded);
  return ctx.emit(ctx.constants.EVENT_RECALCULATED); //cols.shuffle(ctx, children, refresh, loaded);
};

/**
 * Polyfill from https://github.com/jonathantneal/element-qsa-scope
 */
/* eslint-disable */
var init = function init() {
  try {
    // test for scope support
    document.createElement('a').querySelector(':scope *');
  } catch (error) {
    (function () {
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
        return function (selectors) {
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaults = {
  columns: 4,
  margin: 2,
  trueOrder: false,
  waitForImages: false,
  useImageLoader: true,
  breakAt: {},
  useOwnImageLoader: false,
  onInit: false
};

init();

/**
 * Masonary Factory
 * @param {Object} opts - The configuration object for macy.
 */
var Macy = function Macy() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;

  /**
   * Create instance of macy if not instantiated with new Macy
   */
  if (!(this instanceof Macy)) {
    return new Macy(opts);
  }

  this.options = {};
  _extends(this.options, defaults, opts);

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
Macy.prototype.recalculateOnImageLoad = function () {
  var waitUntilFinish = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var imgs = $e('img', this.container);
  return imagesLoadedNew(this, imgs, !waitUntilFinish);
};

/**
 * Run a function on every image load or once all images are loaded
 * @param  {Function}  func      - Function to run on image load
 * @param  {Boolean} everyLoad   - If true it will run everytime an image loads
 */
Macy.prototype.runOnImageLoad = function (func) {
  var everyLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var imgs = $e('img', this.container);
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
Macy.prototype.recalculate = function () {
  var _this = this;

  var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var loaded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (loaded) {
    this.queue.clear();
  }

  return this.queue.add(function () {
    return calculate(_this, refresh, loaded);
  });
};

/**
 * Destroys macy instance
 */
Macy.prototype.remove = function () {
  window.removeEventListener('resize', this.resizer);

  foreach(this.container.children, function (child) {
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
  EVENT_RESIZE: 'macy.resize'
};

Macy.prototype.constants = Macy.constants;

export default Macy;
