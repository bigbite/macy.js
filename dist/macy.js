/*!
 * Macy.js v2.0.0 - Macy is a lightweight, dependency free, masonry layout library
 * Author: Copyright (c) Big Bite Creative <@bigbitecreative> <http://bigbitecreative.com>
 * Url: http://macyjs.com/
 * License: MIT
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Macy = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.NodeListFix = mod.exports;
  }
})(this, function () {
  'use strict';

  var methods = Object.getOwnPropertyNames(Array.prototype);

  methods.forEach(function (methodName) {
    if (methodName !== 'length') {
      NodeList.prototype[methodName] = Array.prototype[methodName];
      HTMLCollection.prototype[methodName] = Array.prototype[methodName];
    }
  });
});

},{}],2:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.async = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * A hacky way to make a function asynchronous
   * @param  {Function} fn  - The Function to be ran asynchronously
   * @param  {Function} cb  - A optional function that runs after fn
   */
  var async = function async(fn, cb) {
    setTimeout(function () {
      var x = fn();
      if (cb) {
        cb(x);
      }
    }, 0);
  };

  exports.default = async;
});

},{}],3:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './async'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./async'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.async);
    global.imagesLoaded = mod.exports;
  }
})(this, function (exports, _async) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _async2 = _interopRequireDefault(_async);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * This function calls the during and after function
   * @param  {Function} during - A function to be ran on each image load
   * @param  {Function} after  - A function to be ran once all images are loaded
   * @param  {Object} data     - An object containing number of complete images and number of loaded
   */
  var imagesComplete = function imagesComplete(during, after, data) {
    if (during) {
      (0, _async2.default)(during);
    }

    if (data.req === data.complete) {
      (0, _async2.default)(after);
    }
  };

  /**
   * Checks through all images and runs the function on complete images
   * @param  {NodeList} imgs   - Image Elements
   * @param  {Function} during - Function to on each image load
   * @param  {Function} after  - Function to run once all images loaded
   */
  var imagesLoaded = function imagesLoaded(imgs, during, after) {
    var imgLen = imgs.length;
    var imgComplete = 0;

    imgs.forEach(function (img) {
      if (img.complete) {
        imgComplete++;
        imagesComplete(during, after, {
          req: imgLen,
          complete: imgComplete
        });
      }

      img.addEventListener('load', function () {
        imgComplete++;
        imagesComplete(during, after, {
          req: imgLen,
          complete: imgComplete
        });
      });
    });
  };

  exports.default = imagesLoaded;
});

},{"./async":2}],4:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.prop = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
  };
});

},{}],5:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.wait = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.wait = wait;
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
  };
});

},{}],6:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', './modules/$e', './modules/calculate', './helpers/imagesLoaded', './helpers/wait', './helpers/NodeListFix'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('./modules/$e'), require('./modules/calculate'), require('./helpers/imagesLoaded'), require('./helpers/wait'), require('./helpers/NodeListFix'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.$e, global.calculate, global.imagesLoaded, global.wait, global.NodeListFix);
    global.macy = mod.exports;
  }
})(this, function (module, _$e, _calculate, _imagesLoaded, _wait) {
  'use strict';

  var _$e2 = _interopRequireDefault(_$e);

  var _calculate2 = _interopRequireDefault(_calculate);

  var _imagesLoaded2 = _interopRequireDefault(_imagesLoaded);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var defaults = {
    columns: 4,
    margin: 2,
    trueOrder: true,
    waitForImages: false
  };

  /**
   * Masonary Factory
   * @param {Object} opts - The configuration object for macy.
   */
  var Macy = function Macy() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;

    /**
     * Create instance of macy if not instatiated with new Macy
     */
    if (!(this instanceof Macy)) {
      return new Macy(opts);
    }
    this.options = {};
    _extends(this.options, defaults, opts);
    // this.options = opts;
    this.container = (0, _$e2.default)(opts.container);

    // Checks if container element exists
    if (this.container instanceof _$e2.default || !this.container) {
      return opts.debug ? console.error('Error: Container not found') : false;
    }

    // Remove container selector from the options
    delete this.options.container;

    if (this.container.length) {
      this.container = this.container[0];
    }

    this.container.style.position = 'relative';
    this.rows = [];

    var loadingEvent = this.recalculate.bind(this, false, false);
    var finishedLoading = this.recalculate.bind(this, true, true);

    var imgs = (0, _$e2.default)('img', this.container);

    this.resizer = (0, _wait.wait)(function () {
      finishedLoading();
    }, 100);

    window.addEventListener('resize', this.resizer);

    if (opts.waitForImages) {
      return (0, _imagesLoaded2.default)(imgs, null, finishedLoading);
    }

    this.recalculate(true, false);
    (0, _imagesLoaded2.default)(imgs, loadingEvent, finishedLoading);
  };

  Macy.init = function (options) {
    return new Macy(options);
  };

  /**
   * Public method for recalculating image positions when the images have loaded.
   * @param  {Boolean} waitUntilFinish - if true it will not recalculate until all images are finished loading
   * @param  {Boolean} refresh         - If true it will recalculate the entire container instead of just new elements.
   */
  Macy.prototype.recalculateOnImageLoad = function () {
    var waitUntilFinish = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var imgs = (0, _$e2.default)('img', this.container);
    var loadingEvent = this.recalculate.bind(this, false, false);
    var finalEvent = this.recalculate.bind(this, false, true);

    if (waitUntilFinish) {
      return (0, _imagesLoaded2.default)(imgs, null, finalEvent);
    }

    loadingEvent();
    return (0, _imagesLoaded2.default)(imgs, loadingEvent, finalEvent);
  };

  /**
   * Run a function on every image load or once all images are loaded
   * @param  {Function}  func      - Function to run on image load
   * @param  {Boolean} everyLoad   - If true it will run everytime an image loads
   */
  Macy.prototype.runOnImageLoad = function (func) {
    var everyLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var imgs = (0, _$e2.default)('img', this.container);

    if (everyLoad) {
      return (0, _imagesLoaded2.default)(imgs, func, func);
    }

    return (0, _imagesLoaded2.default)(imgs, null, func);
  };

  /**
   * Recalculates masonory positions
   * @param  {Boolean} refresh - Recalculates All elements within the container
   * @param  {Boolean} loaded  - When true it sets the recalculated elements to be marked as complete
   */
  Macy.prototype.recalculate = function () {
    var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var loaded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return (0, _calculate2.default)(this, refresh, loaded);
  };

  /**
   * Destroys macy instance
   */
  Macy.prototype.remove = function () {
    window.removeEventListener('resize', this.resizer);

    this.container.children.forEach(function (child) {
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
    window.addEventListener('resize', this.resizer);
  };

  /**
   * Export Macy
   */
  module.exports = Macy;
});

},{"./helpers/NodeListFix":1,"./helpers/imagesLoaded":3,"./helpers/wait":5,"./modules/$e":7,"./modules/calculate":8}],7:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.$e = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
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

  exports.default = $e;
});

},{}],8:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './$e', './calculations', './columns'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./$e'), require('./calculations'), require('./columns'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.$e, global.calculations, global.columns);
    global.calculate = mod.exports;
  }
})(this, function (exports, _$e, _calculations, _columns) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _$e2 = _interopRequireDefault(_$e);

  var cols = _interopRequireWildcard(_columns);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Calculates the column widths and postitions dependant on options.
   * @param  {Macy}  ctx       - Macy instance
   * @param  {Boolean} refresh - Should calculate recalculate all elements
   * @param  {Boolean} loaded  - Should all elements be marked as compelete
   */
  var calculate = function calculate(ctx) {
    var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var loaded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var children = refresh ? ctx.container.children : (0, _$e2.default)(':scope > *:not([data-macy-complete="1"])', ctx.container);
    var eleWidth = (0, _calculations.getWidths)(ctx.options);

    children.forEach(function (child) {
      if (refresh) {
        child.dataset.macyComplete = 0;
      }
      child.style.width = eleWidth;
    });

    if (ctx.options.trueOrder) {
      return cols.sort(ctx, children, refresh, loaded);
    }

    return cols.shuffle(ctx, children, refresh, loaded);
  };

  exports.default = calculate;
});

},{"./$e":7,"./calculations":9,"./columns":10}],9:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.calculations = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getCurrentColumns = getCurrentColumns;
  exports.getWidths = getWidths;
  exports.getLeftPosition = getLeftPosition;
  exports.setContainerHeight = setContainerHeight;
  /**
   * Return the current number of columns macy should be
   * @param  {Object} options - Macy instance's options
   * @return {Integer}        - Number of columns
   */
  function getCurrentColumns(options) {
    var docWidth = document.body.clientWidth;
    var noOfColumns = void 0;

    for (var widths in options.breakAt) {
      if (docWidth < widths) {
        noOfColumns = options.breakAt[widths];
        break;
      }
    }

    if (!noOfColumns) {
      noOfColumns = options.columns;
    }

    return noOfColumns;
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
    var margin = getColumnMargins(options);
    var margins = void 0;
    var width = 100 / noOfColumns;

    if (!marginsIncluded) {
      return width;
    }

    if (noOfColumns === 1) {
      return '100%';
    }

    margins = (noOfColumns - 1) * options.margin / noOfColumns;
    return 'calc(' + width + '% - ' + margins + 'px)';
  };

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
        str = void 0;

    col++;

    if (col === 1) {
      return 0;
    }

    margin = (ctx.options.margin - (noOfColumns - 1) * ctx.options.margin / noOfColumns) * (col - 1);
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


    for (var i = rows.length - 1; i >= 0; i--) {
      largest = rows[i] > largest ? rows[i] : largest;
    }

    container.style.height = largest + 'px';
  }

  var getColumnMargins = function getColumnMargins(opts) {};
});

},{}],10:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './calculations', '../helpers/prop'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./calculations'), require('../helpers/prop'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.calculations, global.prop);
    global.columns = mod.exports;
  }
})(this, function (exports, _calculations, _prop) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shuffle = shuffle;
  exports.sort = sort;

  var _prop2 = _interopRequireDefault(_prop);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

    // Reset rows
    if (refresh) {
      ctx.rows = [];
      ctx.cols = [];
      ctx.lastcol = 0;

      for (var i = cols - 1; i >= 0; i--) {
        ctx.rows[i] = 0;
        ctx.cols[i] = (0, _calculations.getLeftPosition)(ctx, i);
      }
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

    var cols = (0, _calculations.getCurrentColumns)(ctx.options);
    setUpRows(ctx, cols, refresh);

    $eles.forEach(function (ele, key) {
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
      ctx.rows[smallest] += !isNaN(eleHeight) ? eleHeight + ctx.options.margin : 0;

      if (markasComplete) {
        ele.dataset.macyComplete = 1;
      }
    });

    if (markasComplete) {
      ctx.tmpRows = null;
    }

    (0, _calculations.setContainerHeight)(ctx);
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

    var cols = (0, _calculations.getCurrentColumns)(ctx.options);
    setUpRows(ctx, cols, refresh);

    $eles.forEach(function (ele, key) {

      if (ctx.lastcol === cols) {
        ctx.lastcol = 0;
      }

      var eleHeight = (0, _prop2.default)(ele, 'height');
      eleHeight = parseInt(eleHeight.replace('px', ''), 10);

      if (isNaN(eleHeight)) return;
      ele.style.position = 'absolute';
      ele.style.top = ctx.rows[ctx.lastcol] + 'px';
      ele.style.left = '' + ctx.cols[ctx.lastcol];
      ctx.rows[ctx.lastcol] += !isNaN(eleHeight) ? eleHeight + ctx.options.margin : 0;
      ctx.lastcol += 1;

      if (markasComplete) {
        ele.dataset.macyComplete = 1;
      }
    });

    if (markasComplete) {
      ctx.tmpRows = null;
    }

    (0, _calculations.setContainerHeight)(ctx);
  }
});

},{"../helpers/prop":4,"./calculations":9}]},{},[6])(6)
});
