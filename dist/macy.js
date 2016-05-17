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

  var imagesComplete = function imagesComplete(during, after, data) {
    if (during) {
      (0, _async2.default)(during);
    }

    if (data.req === data.complete) {
      (0, _async2.default)(after);
    }
  };

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
  var Macy = function Macy(opts) {
    /**
     * Creact instance of macy if not instatiated with new Macy
     */
    if (!(this instanceof Macy)) {
      return new Macy(opts);
    }
    this.options = Object.assign(defaults, opts) || defaults;
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

  /**
   * Public method for recalculating image positions when the images have loaded.
   * @param  {Boolean} waitUntilFinish - if true it will not recalculate until all images are finished loading
   * @param  {Boolean} refresh         - If true it will recalculate the entire container instead of just new elements.
   */
  Macy.prototype.recalculateOnImageLoad = function () {
    var waitUntilFinish = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var refresh = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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
    var everyLoad = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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
    var refresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var loaded = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

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
    var refresh = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var loaded = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

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
    var marginsIncluded = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    var noOfColumns = getCurrentColumns(options);
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
    var container = ctx.container;
    var rows = ctx.rows;


    for (var i = rows.length - 1; i >= 0; i--) {
      largest = rows[i] > largest ? rows[i] : largest;
    }

    container.style.height = largest + 'px';
  }
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

  var setUpRows = function setUpRows(ctx, cols) {
    var refresh = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];


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
    } else {
      ctx.tmpRows = [];
      for (var i = cols - 1; i >= 0; i--) {
        ctx.tmpRows[i] = ctx.rows[i];
      }
    }
  };

  function shuffle(ctx, $eles) {
    var refresh = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var markasComplete = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    var cols = (0, _calculations.getCurrentColumns)(ctx.options);
    setUpRows(ctx, cols, refresh);

    $eles.forEach(function (ele, key) {
      var smallest = 0;
      var eleHeight = (0, _prop2.default)(ele, 'height');
      eleHeight = parseInt(eleHeight.replace('px', ''), 10);

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

  function sort(ctx, $eles) {
    var refresh = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var markasComplete = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaGVscGVycy9Ob2RlTGlzdEZpeC5qcyIsInNyYy9oZWxwZXJzL2FzeW5jLmpzIiwic3JjL2hlbHBlcnMvaW1hZ2VzTG9hZGVkLmpzIiwic3JjL2hlbHBlcnMvcHJvcC5qcyIsInNyYy9oZWxwZXJzL3dhaXQuanMiLCJzcmMvbWFjeS5qcyIsInNyYy9tb2R1bGVzLyRlLmpzIiwic3JjL21vZHVsZXMvY2FsY3VsYXRlLmpzIiwic3JjL21vZHVsZXMvY2FsY3VsYXRpb25zLmpzIiwic3JjL21vZHVsZXMvY29sdW1ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLE1BQUksVUFBVSxPQUFPLG1CQUFQLENBQTJCLE1BQU0sU0FBakMsQ0FBZDs7QUFFQSxVQUFRLE9BQVIsQ0FBZ0IsVUFBQyxVQUFELEVBQWdCO0FBQzlCLFFBQUksZUFBZSxRQUFuQixFQUE2QjtBQUMzQixlQUFTLFNBQVQsQ0FBbUIsVUFBbkIsSUFBaUMsTUFBTSxTQUFOLENBQWdCLFVBQWhCLENBQWpDO0FBQ0EscUJBQWUsU0FBZixDQUF5QixVQUF6QixJQUF1QyxNQUFNLFNBQU4sQ0FBZ0IsVUFBaEIsQ0FBdkM7QUFDRDtBQUNGLEdBTEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGQSxNQUFJLFFBQVEsU0FBUixLQUFRLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBWTtBQUN0QixlQUFXLFlBQU07QUFDZixVQUFJLElBQUksSUFBUjtBQUNBLFVBQUksRUFBSixFQUFRO0FBQ04sV0FBRyxDQUFIO0FBQ0Q7QUFDRixLQUxELEVBS0csQ0FMSDtBQU1ELEdBUEQ7O29CQVNlLEs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQZixNQUFJLGlCQUFpQixTQUFqQixjQUFpQixDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLElBQWhCLEVBQXlCO0FBQzVDLFFBQUksTUFB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UyxJQUFJLE9BQWIsQ0FBcEI7QUFDQSxVQUFJLElBQUosQ0FBUyxJQUFJLE9BQWIsS0FBeUIsQ0FBQyxNQUFNLFNBQU4sQ0FBRCxHQUFvQixZQUFZLElBQUksT0FBSixDQUFZLE1BQTVDLEdBQXFELENBQTlFO0FBQ0EsVUFBSSxPQUFKLElBQWUsQ0FBZjs7QUFFQSxVQUFJLGNBQUosRUFBb0I7QUFDbEIsWUFBSSxPQUFKLENBQVksWUFBWixHQUEyQixDQUEzQjtBQUNEO0FBQ0YsS0FuQkQ7O0FBcUJBLFFBQUksY0FBSixFQUFvQjtBQUNsQixVQUFJLE9BQUosR0FBYyxJQUFkO0FBQ0Q7O0FBRUQsMENBQW1CLEdBQW5CO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IG1ldGhvZHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhBcnJheS5wcm90b3R5cGUpO1xuXG5tZXRob2RzLmZvckVhY2goKG1ldGhvZE5hbWUpID0+IHtcbiAgaWYgKG1ldGhvZE5hbWUgIT09ICdsZW5ndGgnKSB7XG4gICAgTm9kZUxpc3QucHJvdG90eXBlW21ldGhvZE5hbWVdID0gQXJyYXkucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuICAgIEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IEFycmF5LnByb3RvdHlwZVttZXRob2ROYW1lXTtcbiAgfVxufSk7XG4iLCJsZXQgYXN5bmMgPSAoZm4sIGNiKSA9PiB7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGxldCB4ID0gZm4oKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGNiKHgpO1xuICAgIH1cbiAgfSwgMCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jO1xuIiwiaW1wb3J0IGFzeW5jIGZyb20gJy4vYXN5bmMnO1xuXG5sZXQgaW1hZ2VzQ29tcGxldGUgPSAoZHVyaW5nLCBhZnRlciwgZGF0YSkgPT4ge1xuICBpZiAoZHVyaW5nKSB7XG4gICAgYXN5bmMoZHVyaW5nKTtcbiAgfVxuXG4gIGlmIChkYXRhLnJlcSA9PT0gZGF0YS5jb21wbGV0ZSkge1xuICAgIGFzeW5jKGFmdGVyKTtcbiAgfVxufVxuXG5sZXQgaW1hZ2VzTG9hZGVkID0gKGltZ3MsIGR1cmluZywgYWZ0ZXIpID0+IHtcbiAgbGV0IGltZ0xlbiA9IGltZ3MubGVuZ3RoO1xuICBsZXQgaW1nQ29tcGxldGUgPSAwO1xuXG4gIGltZ3MuZm9yRWFjaCgoaW1nKSA9PiB7XG4gICAgaWYgKGltZy5jb21wbGV0ZSkge1xuICAgICAgaW1nQ29tcGxldGUrKztcbiAgICAgIGltYWdlc0NvbXBsZXRlKGR1cmluZywgYWZ0ZXIsIHtcbiAgICAgICAgICByZXE6IGltZ0xlbixcbiAgICAgICAgICBjb21wbGV0ZTogaW1nQ29tcGxldGVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICBpbWdDb21wbGV0ZSsrO1xuICAgICAgaW1hZ2VzQ29tcGxldGUoZHVyaW5nLCBhZnRlciwge1xuICAgICAgICByZXE6IGltZ0xlbixcbiAgICAgICAgY29tcGxldGU6IGltZ0NvbXBsZXRlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IGltYWdlc0xvYWRlZDtcbiIsImV4cG9ydCBkZWZhdWx0IChlbGVtZW50LCBwcm9wZXJ0eSkgPT4ge1xuICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSlcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiB3YWl0IChmdW5jLCBkZWx0YSkge1xuICBsZXQgdG87XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodG8pIHtcbiAgICAgIGNsZWFyVGltZW91dCh0byk7XG4gICAgfVxuXG4gICAgdG8gPSBzZXRUaW1lb3V0KGZ1bmMsIGRlbHRhKTtcbiAgfTtcbn07XG4iLCJpbXBvcnQgJy4vaGVscGVycy9Ob2RlTGlzdEZpeCc7XG5cbmltcG9ydCAkZSBmcm9tICcuL21vZHVsZXMvJGUnO1xuaW1wb3J0IGNhbGN1bGF0ZSBmcm9tICcuL21vZHVsZXMvY2FsY3VsYXRlJztcbmltcG9ydCBpbWFnZXNMb2FkZWQgZnJvbSAnLi9oZWxwZXJzL2ltYWdlc0xvYWRlZCc7XG5pbXBvcnQge3dhaXR9IGZyb20gJy4vaGVscGVycy93YWl0JztcblxuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgY29sdW1uczogNCxcbiAgbWFyZ2luOiAyLFxuICB0cnVlT3JkZXI6IHRydWUsXG4gIHdhaXRGb3JJbWFnZXM6IGZhbHNlXG59O1xuXG4vKipcbiAqIE1hc29uYXJ5IEZhY3RvcnlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gVGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciBtYWN5LlxuICovXG5sZXQgTWFjeSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gIC8qKlxuICAgKiBDcmVhY3QgaW5zdGFuY2Ugb2YgbWFjeSBpZiBub3QgaW5zdGF0aWF0ZWQgd2l0aCBuZXcgTWFjeVxuICAgKi9cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1hY3kpKSB7XG4gICAgcmV0dXJuIG5ldyBNYWN5KG9wdHMpXG4gIH1cbiAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0cykgfHwgZGVmYXVsdHM7XG4gIC8vIHRoaXMub3B0aW9ucyA9IG9wdHM7XG4gIHRoaXMuY29udGFpbmVyID0gJGUob3B0cy5jb250YWluZXIpO1xuXG4gIC8vIENoZWNrcyBpZiBjb250YWluZXIgZWxlbWVudCBleGlzdHNcbiAgaWYgKHRoaXMuY29udGFpbmVyIGluc3RhbmNlb2YgJGUgfHwgIXRoaXMuY29udGFpbmVyKSB7XG4gICAgcmV0dXJuIG9wdHMuZGVidWcgPyBjb25zb2xlLmVycm9yKCdFcnJvcjogQ29udGFpbmVyIG5vdCBmb3VuZCcpIDogZmFsc2U7XG4gIH1cblxuICAvLyBSZW1vdmUgY29udGFpbmVyIHNlbGVjdG9yIGZyb20gdGhlIG9wdGlvbnNcbiAgZGVsZXRlIHRoaXMub3B0aW9ucy5jb250YWluZXI7XG5cbiAgaWYgKHRoaXMuY29udGFpbmVyLmxlbmd0aCkge1xuICAgIHRoaXMuY29udGFpbmVyID0gdGhpcy5jb250YWluZXJbMF07XG4gIH1cblxuICB0aGlzLmNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gIHRoaXMucm93cyA9IFtdO1xuXG4gIGxldCBsb2FkaW5nRXZlbnQgPSB0aGlzLnJlY2FsY3VsYXRlLmJpbmQodGhpcywgZmFsc2UsIGZhbHNlKTtcbiAgbGV0IGZpbmlzaGVkTG9hZGluZyA9IHRoaXMucmVjYWxjdWxhdGUuYmluZCh0aGlzLCB0cnVlLCB0cnVlKTtcblxuICBsZXQgaW1ncyA9ICRlKCdpbWcnLCB0aGlzLmNvbnRhaW5lcik7XG5cbiAgdGhpcy5yZXNpemVyID0gd2FpdCgoKSA9PiB7XG4gICAgZmluaXNoZWRMb2FkaW5nKCk7XG4gIH0sIDEwMCk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplcik7XG5cbiAgaWYgKG9wdHMud2FpdEZvckltYWdlcykge1xuICAgIHJldHVybiBpbWFnZXNMb2FkZWQoaW1ncywgbnVsbCwgZmluaXNoZWRMb2FkaW5nKTtcbiAgfVxuXG4gIHRoaXMucmVjYWxjdWxhdGUodHJ1ZSwgZmFsc2UpO1xuICBpbWFnZXNMb2FkZWQoaW1ncywgbG9hZGluZ0V2ZW50LCBmaW5pc2hlZExvYWRpbmcpO1xufVxuXG4vKipcbiAqIFB1YmxpYyBtZXRob2QgZm9yIHJlY2FsY3VsYXRpbmcgaW1hZ2UgcG9zaXRpb25zIHdoZW4gdGhlIGltYWdlcyBoYXZlIGxvYWRlZC5cbiAqIEBwYXJhbSAge0Jvb2xlYW59IHdhaXRVbnRpbEZpbmlzaCAtIGlmIHRydWUgaXQgd2lsbCBub3QgcmVjYWxjdWxhdGUgdW50aWwgYWxsIGltYWdlcyBhcmUgZmluaXNoZWQgbG9hZGluZ1xuICogQHBhcmFtICB7Qm9vbGVhbn0gcmVmcmVzaCAgICAgICAgIC0gSWYgdHJ1ZSBpdCB3aWxsIHJlY2FsY3VsYXRlIHRoZSBlbnRpcmUgY29udGFpbmVyIGluc3RlYWQgb2YganVzdCBuZXcgZWxlbWVudHMuXG4gKi9cbk1hY3kucHJvdG90eXBlLnJlY2FsY3VsYXRlT25JbWFnZUxvYWQgPSBmdW5jdGlvbiAod2FpdFVudGlsRmluaXNoID0gZmFsc2UsIHJlZnJlc2ggPSBmYWxzZSkge1xuICBsZXQgaW1ncyA9ICRlKCdpbWcnLCB0aGlzLmNvbnRhaW5lcik7XG4gIGxldCBsb2FkaW5nRXZlbnQgPSB0aGlzLnJlY2FsY3VsYXRlLmJpbmQodGhpcywgZmFsc2UsIGZhbHNlKTtcbiAgbGV0IGZpbmFsRXZlbnQgPSB0aGlzLnJlY2FsY3VsYXRlLmJpbmQodGhpcywgZmFsc2UsIHRydWUpO1xuXG4gIGlmICh3YWl0VW50aWxGaW5pc2gpIHtcbiAgICByZXR1cm4gaW1hZ2VzTG9hZGVkKGltZ3MsIG51bGwsIGZpbmFsRXZlbnQpO1xuICB9XG5cbiAgbG9hZGluZ0V2ZW50KCk7XG4gIHJldHVybiBpbWFnZXNMb2FkZWQoaW1ncywgbG9hZGluZ0V2ZW50LCBmaW5hbEV2ZW50KTtcbn1cblxuLyoqXG4gKiBSdW4gYSBmdW5jdGlvbiBvbiBldmVyeSBpbWFnZSBsb2FkIG9yIG9uY2UgYWxsIGltYWdlcyBhcmUgbG9hZGVkXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gIGZ1bmMgICAgICAtIEZ1bmN0aW9uIHRvIHJ1biBvbiBpbWFnZSBsb2FkXG4gKiBAcGFyYW0gIHtCb29sZWFufSBldmVyeUxvYWQgICAtIElmIHRydWUgaXQgd2lsbCBydW4gZXZlcnl0aW1lIGFuIGltYWdlIGxvYWRzXG4gKi9cbk1hY3kucHJvdG90eXBlLnJ1bk9uSW1hZ2VMb2FkID0gZnVuY3Rpb24gKGZ1bmMsIGV2ZXJ5TG9hZCA9IGZhbHNlKSB7XG4gIGxldCBpbWdzID0gJGUoJ2ltZycsIHRoaXMuY29udGFpbmVyKTtcblxuICBpZiAoZXZlcnlMb2FkKSB7XG4gICAgcmV0dXJuIGltYWdlc0xvYWRlZChpbWdzLCBmdW5jLCBmdW5jKTtcbiAgfVxuXG4gIHJldHVybiBpbWFnZXNMb2FkZWQoaW1ncywgbnVsbCwgZnVuYyk7XG59XG5cbi8qKlxuICogUmVjYWxjdWxhdGVzIG1hc29ub3J5IHBvc2l0aW9uc1xuICogQHBhcmFtICB7Qm9vbGVhbn0gcmVmcmVzaCAtIFJlY2FsY3VsYXRlcyBBbGwgZWxlbWVudHMgd2l0aGluIHRoZSBjb250YWluZXJcbiAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRlZCAgLSBXaGVuIHRydWUgaXQgc2V0cyB0aGUgcmVjYWxjdWxhdGVkIGVsZW1lbnRzIHRvIGJlIG1hcmtlZCBhcyBjb21wbGV0ZVxuICovXG5NYWN5LnByb3RvdHlwZS5yZWNhbGN1bGF0ZSA9IGZ1bmN0aW9uIChyZWZyZXNoID0gZmFsc2UsIGxvYWRlZCA9IHRydWUpIHtcbiAgcmV0dXJuIGNhbGN1bGF0ZSh0aGlzLCByZWZyZXNoLCBsb2FkZWQpO1xufVxuXG4vKipcbiAqIERlc3Ryb3lzIG1hY3kgaW5zdGFuY2VcbiAqL1xuTWFjeS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVyKTtcblxuICB0aGlzLmNvbnRhaW5lci5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgIGNoaWxkLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1tYWN5LWNvbXBsZXRlJyk7XG4gICAgY2hpbGQucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICB9KTtcblxuICB0aGlzLmNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG59XG5cbi8qKlxuICogUmVJbml0aWFsaXplcyB0aGUgbWFjeSBpbnN0YW5jZSB1c2luZyB0aGUgYWxyZWFkeSBkZWZpbmVkIG9wdGlvbnNcbiAqL1xuTWFjeS5wcm90b3R5cGUucmVJbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnJlY2FsY3VsYXRlKHRydWUsIHRydWUpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVyKTtcbn1cblxuLyoqXG4gKiBFeHBvcnQgTWFjeVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IE1hY3k7XG4iLCIvKipcbiAqIEVsZW1lbnQgRmFjdG9yeVxuICogQHBhcmFtICB7U3RyaW5nfSBwYXJhbWV0ZXIgICAgICAgLSBFbGVtZW50IFNlbGVjdG9yXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gY29udGV4dCAgICAtIFRoZSBwYXJlbnQgdG8gZmluZCB0aGUgc2VsZWN0b3IgaW5cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50L0hUTUxDb2xsZWN0aW9ufVxuICovXG5sZXQgJGUgPSBmdW5jdGlvbiAocGFyYW1ldGVyLCBjb250ZXh0KSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiAkZSkpIHtcbiAgICByZXR1cm4gbmV3ICRlKHBhcmFtZXRlciwgY29udGV4dCk7XG4gIH1cblxuICAvLyBBbGxvdyBmb3Igc3BhY2VzIGJlZm9yZSBvciBhZnRlclxuICBwYXJhbWV0ZXIgPSBwYXJhbWV0ZXIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG5cbiAgaWYgKGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5ieUNzcyhwYXJhbWV0ZXIsIGNvbnRleHQpO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIHRoaXMuc2VsZWN0b3JzKSB7XG4gICAgLy8gUmV1c2luZyBpdCB0byBzYXZlIHNwYWNlXG4gICAgY29udGV4dCA9IGtleS5zcGxpdCgnLycpO1xuICAgIGlmICgobmV3IFJlZ0V4cChjb250ZXh0WzFdLCBjb250ZXh0WzJdKSkudGVzdChwYXJhbWV0ZXIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RvcnNba2V5XShwYXJhbWV0ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLmJ5Q3NzKHBhcmFtZXRlcik7XG59O1xuXG4vKipcbiAqIEdldCBhbiBlbGVtZW50IGJ5IHVzaW5nIHF1ZXJ5U2VsZWN0b3JBbGxcbiAqIEBwYXJhbSAge1N0cmluZ30gcGFyYW1ldGVyICAgICAgIC0gRWxlbWVudCBTZWxlY3RvclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGNvbnRleHQgICAgLSBUaGUgcGFyZW50IHRvIGZpbmQgdGhlIHNlbGVjdG9yIGluXG4gKiBAcmV0dXJuIHtOb2RlTGlzdH1cbiAqL1xuJGUucHJvdG90eXBlLmJ5Q3NzID0gZnVuY3Rpb24gKHBhcmFtZXRlciwgY29udGV4dCkge1xuICByZXR1cm4gKGNvbnRleHQgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwocGFyYW1ldGVyKTtcbn07XG5cblxuJGUucHJvdG90eXBlLnNlbGVjdG9ycyA9IHt9O1xuXG4vKipcbiAqIEdldCBhbiBlbGVtZW50IGJ5IHVzaW5nIGdldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAqIEBwYXJhbSAge1N0cmluZ30gcGFyYW0gICAtIEVsZW1lbnQgU2VsZWN0b3JcbiAqIEByZXR1cm4ge0hUTUxDb2xsZWN0aW9ufVxuICovXG4kZS5wcm90b3R5cGUuc2VsZWN0b3JzWy9eXFwuW1xcd1xcLV0rJC9dID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHBhcmFtLnN1YnN0cmluZygxKSk7XG59O1xuXG4vKipcbiAqIEdldCBhbiBlbGVtZW50IGJ5IHVzaW5nIGdldEVsZW1lbnRzQnlUYWdOYW1lXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHBhcmFtICAgLSBFbGVtZW50IFNlbGVjdG9yXG4gKiBAcmV0dXJuIHtIVE1MQ29sbGVjdGlvbn0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG4kZS5wcm90b3R5cGUuc2VsZWN0b3JzWy9eXFx3KyQvXSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocGFyYW0pO1xufTtcblxuLyoqXG4gKiBHZXQgYW4gZWxlbWVudCBieSB1c2luZyBnZXRFbGVtZW50c0J5VGFnTmFtZVxuICogQHBhcmFtICB7U3RyaW5nfSBwYXJhbSAgIC0gRWxlbWVudCBTZWxlY3RvclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG4gKi9cbiRlLnByb3RvdHlwZS5zZWxlY3RvcnNbL15cXCNbXFx3XFwtXSskL10gPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmFtLnN1YnN0cmluZygxKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCAkZTtcbiIsImltcG9ydCAkZSBmcm9tICcuLyRlJztcbmltcG9ydCB7Z2V0V2lkdGhzfSBmcm9tICcuL2NhbGN1bGF0aW9ucyc7XG5pbXBvcnQgKiBhcyBjb2xzIGZyb20gJy4vY29sdW1ucyc7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgY29sdW1uIHdpZHRocyBhbmQgcG9zdGl0aW9ucyBkZXBlbmRhbnQgb24gb3B0aW9ucy5cbiAqIEBwYXJhbSAge01hY3l9ICBjdHggICAgICAgLSBNYWN5IGluc3RhbmNlXG4gKiBAcGFyYW0gIHtCb29sZWFufSByZWZyZXNoIC0gU2hvdWxkIGNhbGN1bGF0ZSByZWNhbGN1bGF0ZSBhbGwgZWxlbWVudHNcbiAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRlZCAgLSBTaG91bGQgYWxsIGVsZW1lbnRzIGJlIG1hcmtlZCBhcyBjb21wZWxldGVcbiAqL1xuY29uc3QgY2FsY3VsYXRlID0gKGN0eCwgcmVmcmVzaCA9IGZhbHNlLCBsb2FkZWQgPSB0cnVlKSA9PiB7XG4gIGxldCBjaGlsZHJlbiA9IHJlZnJlc2ggPyBjdHguY29udGFpbmVyLmNoaWxkcmVuIDogJGUoJzpzY29wZSA+ICo6bm90KFtkYXRhLW1hY3ktY29tcGxldGU9XCIxXCJdKScsIGN0eC5jb250YWluZXIpO1xuICBsZXQgZWxlV2lkdGggPSBnZXRXaWR0aHMoY3R4Lm9wdGlvbnMpO1xuXG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgaWYgKHJlZnJlc2gpIHtcbiAgICAgIGNoaWxkLmRhdGFzZXQubWFjeUNvbXBsZXRlID0gMDtcbiAgICB9XG4gICAgY2hpbGQuc3R5bGUud2lkdGggPSBlbGVXaWR0aDtcbiAgfSk7XG5cbiAgaWYgKGN0eC5vcHRpb25zLnRydWVPcmRlcikge1xuICAgIHJldHVybiBjb2xzLnNvcnQoY3R4LCBjaGlsZHJlbiwgcmVmcmVzaCwgbG9hZGVkKTtcbiAgfVxuXG4gIHJldHVybiBjb2xzLnNodWZmbGUoY3R4LCBjaGlsZHJlbiwgcmVmcmVzaCwgbG9hZGVkKVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlO1xuIiwiLyoqXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgbnVtYmVyIG9mIGNvbHVtbnMgbWFjeSBzaG91bGQgYmVcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyAtIE1hY3kgaW5zdGFuY2UncyBvcHRpb25zXG4gKiBAcmV0dXJuIHtJbnRlZ2VyfSAgICAgICAgLSBOdW1iZXIgb2YgY29sdW1uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudENvbHVtbnMgKG9wdGlvbnMpIHtcbiAgbGV0IGRvY1dpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcbiAgbGV0IG5vT2ZDb2x1bW5zO1xuXG4gIGZvciAobGV0IHdpZHRocyBpbiBvcHRpb25zLmJyZWFrQXQpIHtcbiAgICBpZiAoZG9jV2lkdGggPCB3aWR0aHMpIHtcbiAgICAgIG5vT2ZDb2x1bW5zID0gb3B0aW9ucy5icmVha0F0W3dpZHRoc107XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIW5vT2ZDb2x1bW5zKSB7XG4gICAgbm9PZkNvbHVtbnMgPSBvcHRpb25zLmNvbHVtbnM7XG4gIH1cblxuICByZXR1cm4gbm9PZkNvbHVtbnM7XG59XG5cbi8qKlxuICogR2V0IHRoZSB3aWR0aCBvZiBlYWNoIGNvbHVtbiBiYXNlZCBvbiB0aGUgbnVtYmVyIG9mIGNvbHVtbnNcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyAgICAgICAgICAgLSBNYWN5IGluc3RhbmNlJ3Mgb3B0aW9uc1xuICogQHBhcmFtICB7Qm9vbGVhbn0gbWFyZ2luc0luY2x1ZGVkICAtIEluY2x1ZGUgbWFyZ2lucyBpbnRvIHRoZSBjYWxjdWxhdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgICAgICAgLSBUaGUgY29ycmVjdCBudW1iZXIgY3NzIHN0eWxlIGZvciBjb2x1bW4gd2lkdGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFdpZHRocyAob3B0aW9ucywgbWFyZ2luc0luY2x1ZGVkID0gdHJ1ZSkge1xuICBsZXQgbm9PZkNvbHVtbnMgPSBnZXRDdXJyZW50Q29sdW1ucyhvcHRpb25zKTtcbiAgbGV0IG1hcmdpbnM7XG4gIGxldCB3aWR0aCA9IDEwMCAvIG5vT2ZDb2x1bW5zO1xuXG4gIGlmICghbWFyZ2luc0luY2x1ZGVkKSB7XG4gICAgcmV0dXJuIHdpZHRoO1xuICB9XG5cbiAgaWYgKG5vT2ZDb2x1bW5zID09PSAxKSB7XG4gICAgcmV0dXJuIGAxMDAlYDtcbiAgfVxuXG4gIG1hcmdpbnMgPSAobm9PZkNvbHVtbnMgLSAxKSAqIG9wdGlvbnMubWFyZ2luIC8gbm9PZkNvbHVtbnM7XG4gIHJldHVybiBgY2FsYygke3dpZHRofSUgLSAke21hcmdpbnN9cHgpYDtcbn07XG5cbi8qKlxuICogR2V0IHRoZSBsZWZ0IHBvc2l0aW9uIGJhc2VkIG9uIHdoaWNoIGNvbHVtbiBhbmQgY29sdW1uIHdpZHRoXG4gKiBAcGFyYW0gIHtNYWN5fSAgICBjdHggIC0gTWFjeSBpbnN0YW5jZVxuICogQHBhcmFtICB7SW50ZWdlcn0gY29sICAtIEN1cnJlbnQgTnVtYmVyIG9mIENvbHVtbnNcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgLSBUaGUgY29ycmVjdCBudW1iZXIgY3NzIHN0eWxlIGZvciBjb2x1bW4gcG9zaXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExlZnRQb3NpdGlvbiAoY3R4LCBjb2wpIHtcbiAgbGV0IG5vT2ZDb2x1bW5zID0gZ2V0Q3VycmVudENvbHVtbnMoY3R4Lm9wdGlvbnMpO1xuICBsZXQgdG90YWxMZWZ0ID0gMDtcbiAgbGV0IG1hcmdpbiwgc3RyO1xuXG4gIGNvbCsrO1xuXG4gIGlmIChjb2wgPT09IDEpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIG1hcmdpbiA9IChjdHgub3B0aW9ucy5tYXJnaW4gLSAoKChub09mQ29sdW1ucyAtIDEpICogY3R4Lm9wdGlvbnMubWFyZ2luKSAvIG5vT2ZDb2x1bW5zKSkgKiAoY29sIC0gMSk7XG4gIHRvdGFsTGVmdCArPSBnZXRXaWR0aHMoY3R4Lm9wdGlvbnMsIGZhbHNlKSAqIChjb2wgLSAxKTtcbiAgc3RyID0gJ2NhbGMoJyArIHRvdGFsTGVmdCArICclICsgJyArIG1hcmdpbiArICdweCknO1xuXG4gIHJldHVybiBzdHI7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgY29udGFpbmVycyBoZWlnaHQgYmFzZWQgb24gdGhlIGxhc3QgaXRlbSBpbiB0aGUgY29udGFpbmVyXG4gKiBAcGFyYW0ge01hY3l9IGN0eCAgLSBNYWN5IGluc3RhbmNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRDb250YWluZXJIZWlnaHQgKGN0eCkge1xuICBsZXQgbGFyZ2VzdCA9IDA7XG4gIGxldCB7Y29udGFpbmVyLCByb3dzfSA9IGN0eDtcblxuICBmb3IgKHZhciBpID0gcm93cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGxhcmdlc3QgPSByb3dzW2ldID4gbGFyZ2VzdCA/IHJvd3NbaV0gOiBsYXJnZXN0O1xuICB9XG5cbiAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGAke2xhcmdlc3R9cHhgO1xufVxuIiwiaW1wb3J0IHtnZXRMZWZ0UG9zaXRpb24sIGdldEN1cnJlbnRDb2x1bW5zLCBnZXRXaWR0aHMsIHNldENvbnRhaW5lckhlaWdodH0gZnJvbSAnLi9jYWxjdWxhdGlvbnMnO1xuaW1wb3J0IHByb3AgZnJvbSAnLi4vaGVscGVycy9wcm9wJztcblxuY29uc3Qgc2V0VXBSb3dzID0gKGN0eCwgY29scywgcmVmcmVzaCA9IGZhbHNlKSA9PiB7XG5cbiAgaWYgKCFjdHgubGFzdGNvbCkge1xuICAgIGN0eC5sYXN0Y29sID0gMDtcbiAgfVxuXG4gIC8vIFJlc2V0IHJvd3NcbiAgaWYgKHJlZnJlc2gpIHtcbiAgICBjdHgucm93cyA9IFtdO1xuICAgIGN0eC5jb2xzID0gW107XG4gICAgY3R4Lmxhc3Rjb2wgPSAwO1xuXG4gICAgZm9yICh2YXIgaSA9IGNvbHMgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY3R4LnJvd3NbaV0gPSAwO1xuICAgICAgY3R4LmNvbHNbaV0gPSBnZXRMZWZ0UG9zaXRpb24oY3R4LCBpKTtcbiAgICB9XG4gIH1cblxuICBpZiAoY3R4LnRtcFJvd3MpIHtcbiAgICBjdHgucm93cyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IGNvbHMgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY3R4LnJvd3NbaV0gPSBjdHgudG1wUm93c1tpXTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICBjdHgudG1wUm93cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSBjb2xzIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGN0eC50bXBSb3dzW2ldID0gY3R4LnJvd3NbaV07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaHVmZmxlIChjdHgsICRlbGVzLCByZWZyZXNoID0gZmFsc2UsIG1hcmthc0NvbXBsZXRlID0gdHJ1ZSkge1xuICBsZXQgY29scyA9IGdldEN1cnJlbnRDb2x1bW5zKGN0eC5vcHRpb25zKTtcbiAgc2V0VXBSb3dzKGN0eCwgY29scywgcmVmcmVzaCk7XG5cbiAgJGVsZXMuZm9yRWFjaCgoZWxlLCBrZXkpID0+IHtcbiAgICBsZXQgc21hbGxlc3QgPSAwO1xuICAgIGxldCBlbGVIZWlnaHQgPSBwcm9wKGVsZSwgJ2hlaWdodCcpO1xuICAgIGVsZUhlaWdodCA9IHBhcnNlSW50KGVsZUhlaWdodC5yZXBsYWNlKCdweCcsICcnKSwgMTApO1xuXG4gICAgaWYgKGlzTmFOKGVsZUhlaWdodCkpIHJldHVybjtcblxuICAgIGN0eC5yb3dzLmZvckVhY2goKHYsIGspID0+IHtcbiAgICAgIGlmICh2IDwgY3R4LnJvd3Nbc21hbGxlc3RdKSB7XG4gICAgICAgIHNtYWxsZXN0ID0gaztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGVsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZWxlLnN0eWxlLnRvcCA9IGAke2N0eC5yb3dzW3NtYWxsZXN0XX1weGA7XG4gICAgZWxlLnN0eWxlLmxlZnQgPSBgJHtjdHguY29sc1tzbWFsbGVzdF19YDtcbiAgICBjdHgucm93c1tzbWFsbGVzdF0gKz0gIWlzTmFOKGVsZUhlaWdodCkgPyBlbGVIZWlnaHQgKyBjdHgub3B0aW9ucy5tYXJnaW4gOiAwO1xuXG4gICAgaWYgKG1hcmthc0NvbXBsZXRlKSB7XG4gICAgICBlbGUuZGF0YXNldC5tYWN5Q29tcGxldGUgPSAxO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKG1hcmthc0NvbXBsZXRlKSB7XG4gICAgY3R4LnRtcFJvd3MgPSBudWxsO1xuICB9XG5cbiAgc2V0Q29udGFpbmVySGVpZ2h0KGN0eCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0IChjdHgsICRlbGVzLCByZWZyZXNoID0gZmFsc2UsIG1hcmthc0NvbXBsZXRlID0gdHJ1ZSkge1xuICBsZXQgY29scyA9IGdldEN1cnJlbnRDb2x1bW5zKGN0eC5vcHRpb25zKTtcbiAgc2V0VXBSb3dzKGN0eCwgY29scywgcmVmcmVzaCk7XG5cbiAgJGVsZXMuZm9yRWFjaCgoZWxlLCBrZXkpID0+IHtcblxuICAgIGlmIChjdHgubGFzdGNvbCA9PT0gY29scykge1xuICAgICAgY3R4Lmxhc3Rjb2wgPSAwO1xuICAgIH1cblxuICAgIGxldCBlbGVIZWlnaHQgPSBwcm9wKGVsZSwgJ2hlaWdodCcpO1xuICAgIGVsZUhlaWdodCA9IHBhcnNlSW50KGVsZUhlaWdodC5yZXBsYWNlKCdweCcsICcnKSwgMTApO1xuXG4gICAgaWYgKGlzTmFOKGVsZUhlaWdodCkpIHJldHVybjtcbiAgICBlbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGVsZS5zdHlsZS50b3AgPSBgJHtjdHgucm93c1tjdHgubGFzdGNvbF19cHhgO1xuICAgIGVsZS5zdHlsZS5sZWZ0ID0gYCR7Y3R4LmNvbHNbY3R4Lmxhc3Rjb2xdfWA7XG4gICAgY3R4LnJvd3NbY3R4Lmxhc3Rjb2xdICs9ICFpc05hTihlbGVIZWlnaHQpID8gZWxlSGVpZ2h0ICsgY3R4Lm9wdGlvbnMubWFyZ2luIDogMDtcbiAgICBjdHgubGFzdGNvbCArPSAxO1xuXG4gICAgaWYgKG1hcmthc0NvbXBsZXRlKSB7XG4gICAgICBlbGUuZGF0YXNldC5tYWN5Q29tcGxldGUgPSAxO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKG1hcmthc0NvbXBsZXRlKSB7XG4gICAgY3R4LnRtcFJvd3MgPSBudWxsO1xuICB9XG5cbiAgc2V0Q29udGFpbmVySGVpZ2h0KGN0eCk7XG59XG4iXX0=
