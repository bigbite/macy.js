/*!
 * Macy.js v1.1.2 - Macy is a lightweight, dependency free, masonry layout library
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

  Macy.prototype.runOnImageLoad = function (func) {
    var everyLoad = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var imgs = (0, _$e2.default)('img', this.container);

    if (everyLoad) {
      return (0, _imagesLoaded2.default)(imgs, func, func);
    }

    return (0, _imagesLoaded2.default)(imgs, null, func);
  };

  Macy.prototype.recalculate = function () {
    var refresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var loaded = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    return (0, _calculate2.default)(this, refresh, loaded);
  };

  Macy.prototype.remove = function () {
    window.removeEventListener('resize', this.resizer);

    this.container.children.forEach(function (child) {
      child.removeAttribute('data-macy-complete');
      child.removeAttribute('style');
    });

    this.container.removeAttribute('style');
  };

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

  // Select some elements using a css Selector
  $e.prototype.byCss = function (parameter, context) {
    return (context || document).querySelectorAll(parameter);
  };

  $e.prototype.selectors = {};

  // Find some html nodes using an Id
  $e.prototype.selectors[/^\.[\w\-]+$/] = function (param) {
    return document.getElementsByClassName(param.substring(1));
  };

  //The tag nodes
  $e.prototype.selectors[/^\w+$/] = function (param) {
    return document.getElementsByTagName(param);
  };

  // Find some html nodes using an Id
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

  function setUpRows(ctx, cols) {
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
  }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaGVscGVycy9Ob2RlTGlzdEZpeC5qcyIsInNyYy9oZWxwZXJzL2FzeW5jLmpzIiwic3JjL2hlbHBlcnMvaW1hZ2VzTG9hZGVkLmpzIiwic3JjL2hlbHBlcnMvcHJvcC5qcyIsInNyYy9oZWxwZXJzL3dhaXQuanMiLCJzcmMvbWFjeS5qcyIsInNyYy9tb2R1bGVzLyRlLmpzIiwic3JjL21vZHVsZXMvY2FsY3VsYXRlLmpzIiwic3JjL21vZHVsZXMvY2FsY3VsYXRpb25zLmpzIiwic3JjL21vZHVsZXMvY29sdW1ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLE1BQUksVUFBVSxPQUFPLG1CQUFQLENBQTJCLE1BQU0sU0FBakMsQ0FBZDs7QUFFQSxVQUFRLE9BQVIsQ0FBZ0IsVUFBQyxVQUFELEVBQWdCO0FBQzlCLFFBQUksZUFBZSxRQUFuQixFQUE2QjtBQUMzQixlQUFTLFNBQVQsQ0FBbUIsVUFBbkIsSUFBaUMsTUFBTSxTQUFOLENBQWdCLFVBQWhCLENBQWpDO0FBQ0EscUJBQWUsU0FBZixDQUF5QixVQUF6QixJQUF1QyxNQUFNLFNBQU4sQ0FBZ0IsVUFBaEIsQ0FBdkM7QUFDRDtBQUNGLEdBTEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGQSxNQUFJLFFBQVEsU0FBUixLQUFRLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBWTtBQUN0QixlQUFXLFlBQU07QUFDZixVQUFJLElBQUksSUFBUjtBQUNBLFVBQUksRUFBSixFQUFRO0FBQ04sV0FBRyxDQUFIO0FBQ0Q7QUFDRixLQUxELEVBS0csQ0FMSDtBQU1ELEdBUEQ7O29CQVNlLEs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQZixNQUFJLGlCQUFpQixTQUFqQixjQUFpQixDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLElBQWhCLEVBQXlCO0FBQzVDLFFBQUksTUFB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QSxRQUFJLGNBQUosRUFBb0I7QUFDbEIsVUFBSSxPQUFKLEdBQWMsSUFBZDtBQUNEOztBQUVELDBDQUFtQixHQUFuQjtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBtZXRob2RzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoQXJyYXkucHJvdG90eXBlKTtcblxubWV0aG9kcy5mb3JFYWNoKChtZXRob2ROYW1lKSA9PiB7XG4gIGlmIChtZXRob2ROYW1lICE9PSAnbGVuZ3RoJykge1xuICAgIE5vZGVMaXN0LnByb3RvdHlwZVttZXRob2ROYW1lXSA9IEFycmF5LnByb3RvdHlwZVttZXRob2ROYW1lXTtcbiAgICBIVE1MQ29sbGVjdGlvbi5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBBcnJheS5wcm90b3R5cGVbbWV0aG9kTmFtZV07XG4gIH1cbn0pO1xuIiwibGV0IGFzeW5jID0gKGZuLCBjYikgPT4ge1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBsZXQgeCA9IGZuKCk7XG4gICAgaWYgKGNiKSB7XG4gICAgICBjYih4KTtcbiAgICB9XG4gIH0sIDApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYztcbiIsImltcG9ydCBhc3luYyBmcm9tICcuL2FzeW5jJztcblxubGV0IGltYWdlc0NvbXBsZXRlID0gKGR1cmluZywgYWZ0ZXIsIGRhdGEpID0+IHtcbiAgaWYgKGR1cmluZykge1xuICAgIGFzeW5jKGR1cmluZyk7XG4gIH1cblxuICBpZiAoZGF0YS5yZXEgPT09IGRhdGEuY29tcGxldGUpIHtcbiAgICBhc3luYyhhZnRlcik7XG4gIH1cbn1cblxubGV0IGltYWdlc0xvYWRlZCA9IChpbWdzLCBkdXJpbmcsIGFmdGVyKSA9PiB7XG4gIGxldCBpbWdMZW4gPSBpbWdzLmxlbmd0aDtcbiAgbGV0IGltZ0NvbXBsZXRlID0gMDtcblxuICBpbWdzLmZvckVhY2goKGltZykgPT4ge1xuICAgIGlmIChpbWcuY29tcGxldGUpIHtcbiAgICAgIGltZ0NvbXBsZXRlKys7XG4gICAgICBpbWFnZXNDb21wbGV0ZShkdXJpbmcsIGFmdGVyLCB7XG4gICAgICAgICAgcmVxOiBpbWdMZW4sXG4gICAgICAgICAgY29tcGxldGU6IGltZ0NvbXBsZXRlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgaW1nQ29tcGxldGUrKztcbiAgICAgIGltYWdlc0NvbXBsZXRlKGR1cmluZywgYWZ0ZXIsIHtcbiAgICAgICAgcmVxOiBpbWdMZW4sXG4gICAgICAgIGNvbXBsZXRlOiBpbWdDb21wbGV0ZVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuXG5leHBvcnQgZGVmYXVsdCBpbWFnZXNMb2FkZWQ7XG4iLCJleHBvcnQgZGVmYXVsdCAoZWxlbWVudCwgcHJvcGVydHkpID0+IHtcbiAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gd2FpdCAoZnVuYywgZGVsdGEpIHtcbiAgbGV0IHRvO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRvKSB7XG4gICAgICBjbGVhclRpbWVvdXQodG8pO1xuICAgIH1cblxuICAgIHRvID0gc2V0VGltZW91dChmdW5jLCBkZWx0YSk7XG4gIH07XG59O1xuIiwiaW1wb3J0ICcuL2hlbHBlcnMvTm9kZUxpc3RGaXgnO1xuXG5pbXBvcnQgJGUgZnJvbSAnLi9tb2R1bGVzLyRlJztcbmltcG9ydCBjYWxjdWxhdGUgZnJvbSAnLi9tb2R1bGVzL2NhbGN1bGF0ZSc7XG5pbXBvcnQgaW1hZ2VzTG9hZGVkIGZyb20gJy4vaGVscGVycy9pbWFnZXNMb2FkZWQnO1xuaW1wb3J0IHt3YWl0fSBmcm9tICcuL2hlbHBlcnMvd2FpdCc7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBjb2x1bW5zOiA0LFxuICBtYXJnaW46IDIsXG4gIHRydWVPcmRlcjogdHJ1ZSxcbiAgd2FpdEZvckltYWdlczogZmFsc2Vcbn07XG5cbmxldCBNYWN5ID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgLyoqXG4gICAqIENyZWFjdCBpbnN0YW5jZSBvZiBtYWN5IGlmIG5vdCBpbnN0YXRpYXRlZCB3aXRoIG5ldyBNYWN5XG4gICAqL1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTWFjeSkpIHtcbiAgICByZXR1cm4gbmV3IE1hY3kob3B0cylcbiAgfVxuICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBvcHRzKSB8fCBkZWZhdWx0cztcbiAgLy8gdGhpcy5vcHRpb25zID0gb3B0cztcbiAgdGhpcy5jb250YWluZXIgPSAkZShvcHRzLmNvbnRhaW5lcik7XG5cbiAgLy8gQ2hlY2tzIGlmIGNvbnRhaW5lciBlbGVtZW50IGV4aXN0c1xuICBpZiAodGhpcy5jb250YWluZXIgaW5zdGFuY2VvZiAkZSB8fCAhdGhpcy5jb250YWluZXIpIHtcbiAgICByZXR1cm4gb3B0cy5kZWJ1ZyA/IGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBDb250YWluZXIgbm90IGZvdW5kJykgOiBmYWxzZTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBjb250YWluZXIgc2VsZWN0b3IgZnJvbSB0aGUgb3B0aW9uc1xuICBkZWxldGUgdGhpcy5vcHRpb25zLmNvbnRhaW5lcjtcblxuICBpZiAodGhpcy5jb250YWluZXIubGVuZ3RoKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmNvbnRhaW5lclswXTtcbiAgfVxuXG4gIHRoaXMuY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgdGhpcy5yb3dzID0gW107XG5cbiAgbGV0IGxvYWRpbmdFdmVudCA9IHRoaXMucmVjYWxjdWxhdGUuYmluZCh0aGlzLCBmYWxzZSwgZmFsc2UpO1xuICBsZXQgZmluaXNoZWRMb2FkaW5nID0gdGhpcy5yZWNhbGN1bGF0ZS5iaW5kKHRoaXMsIHRydWUsIHRydWUpO1xuXG4gIGxldCBpbWdzID0gJGUoJ2ltZycsIHRoaXMuY29udGFpbmVyKTtcblxuICB0aGlzLnJlc2l6ZXIgPSB3YWl0KCgpID0+IHtcbiAgICBmaW5pc2hlZExvYWRpbmcoKTtcbiAgfSwgMTAwKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVyKTtcblxuICBpZiAob3B0cy53YWl0Rm9ySW1hZ2VzKSB7XG4gICAgcmV0dXJuIGltYWdlc0xvYWRlZChpbWdzLCBudWxsLCBmaW5pc2hlZExvYWRpbmcpO1xuICB9XG5cbiAgdGhpcy5yZWNhbGN1bGF0ZSh0cnVlLCBmYWxzZSk7XG4gIGltYWdlc0xvYWRlZChpbWdzLCBsb2FkaW5nRXZlbnQsIGZpbmlzaGVkTG9hZGluZyk7XG59XG5cbk1hY3kucHJvdG90eXBlLnJlY2FsY3VsYXRlT25JbWFnZUxvYWQgPSBmdW5jdGlvbiAod2FpdFVudGlsRmluaXNoID0gZmFsc2UsIHJlZnJlc2ggPSBmYWxzZSkge1xuICBsZXQgaW1ncyA9ICRlKCdpbWcnLCB0aGlzLmNvbnRhaW5lcik7XG4gIGxldCBsb2FkaW5nRXZlbnQgPSB0aGlzLnJlY2FsY3VsYXRlLmJpbmQodGhpcywgZmFsc2UsIGZhbHNlKTtcbiAgbGV0IGZpbmFsRXZlbnQgPSB0aGlzLnJlY2FsY3VsYXRlLmJpbmQodGhpcywgZmFsc2UsIHRydWUpO1xuXG4gIGlmICh3YWl0VW50aWxGaW5pc2gpIHtcbiAgICByZXR1cm4gaW1hZ2VzTG9hZGVkKGltZ3MsIG51bGwsIGZpbmFsRXZlbnQpO1xuICB9XG5cbiAgbG9hZGluZ0V2ZW50KCk7XG4gIHJldHVybiBpbWFnZXNMb2FkZWQoaW1ncywgbG9hZGluZ0V2ZW50LCBmaW5hbEV2ZW50KTtcbn1cblxuTWFjeS5wcm90b3R5cGUucnVuT25JbWFnZUxvYWQgPSBmdW5jdGlvbiAoZnVuYywgZXZlcnlMb2FkID0gZmFsc2UpIHtcbiAgbGV0IGltZ3MgPSAkZSgnaW1nJywgdGhpcy5jb250YWluZXIpO1xuXG4gIGlmIChldmVyeUxvYWQpIHtcbiAgICByZXR1cm4gaW1hZ2VzTG9hZGVkKGltZ3MsIGZ1bmMsIGZ1bmMpO1xuICB9XG5cbiAgcmV0dXJuIGltYWdlc0xvYWRlZChpbWdzLCBudWxsLCBmdW5jKTtcbn1cblxuTWFjeS5wcm90b3R5cGUucmVjYWxjdWxhdGUgPSBmdW5jdGlvbiAocmVmcmVzaCA9IGZhbHNlLCBsb2FkZWQgPSB0cnVlKSB7XG4gIHJldHVybiBjYWxjdWxhdGUodGhpcywgcmVmcmVzaCwgbG9hZGVkKTtcbn1cblxuTWFjeS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVyKTtcblxuICB0aGlzLmNvbnRhaW5lci5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgIGNoaWxkLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1tYWN5LWNvbXBsZXRlJyk7XG4gICAgY2hpbGQucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICB9KTtcblxuICB0aGlzLmNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFjeTtcbiIsImxldCAkZSA9IGZ1bmN0aW9uIChwYXJhbWV0ZXIsIGNvbnRleHQpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mICRlKSkge1xuICAgIHJldHVybiBuZXcgJGUocGFyYW1ldGVyLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8vIEFsbG93IGZvciBzcGFjZXMgYmVmb3JlIG9yIGFmdGVyXG4gIHBhcmFtZXRlciA9IHBhcmFtZXRlci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcblxuICBpZiAoY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLmJ5Q3NzKHBhcmFtZXRlciwgY29udGV4dCk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gdGhpcy5zZWxlY3RvcnMpIHtcbiAgICAvLyBSZXVzaW5nIGl0IHRvIHNhdmUgc3BhY2VcbiAgICBjb250ZXh0ID0ga2V5LnNwbGl0KCcvJyk7XG4gICAgaWYgKChuZXcgUmVnRXhwKGNvbnRleHRbMV0sIGNvbnRleHRbMl0pKS50ZXN0KHBhcmFtZXRlcikpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdG9yc1trZXldKHBhcmFtZXRlcik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuYnlDc3MocGFyYW1ldGVyKTtcbn07XG5cbi8vIFNlbGVjdCBzb21lIGVsZW1lbnRzIHVzaW5nIGEgY3NzIFNlbGVjdG9yXG4kZS5wcm90b3R5cGUuYnlDc3MgPSBmdW5jdGlvbiAocGFyYW1ldGVyLCBjb250ZXh0KSB7XG4gIHJldHVybiAoY29udGV4dCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChwYXJhbWV0ZXIpO1xufTtcblxuXG4kZS5wcm90b3R5cGUuc2VsZWN0b3JzID0ge307XG5cbi8vIEZpbmQgc29tZSBodG1sIG5vZGVzIHVzaW5nIGFuIElkXG4kZS5wcm90b3R5cGUuc2VsZWN0b3JzWy9eXFwuW1xcd1xcLV0rJC9dID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHBhcmFtLnN1YnN0cmluZygxKSk7XG59O1xuXG4vL1RoZSB0YWcgbm9kZXNcbiRlLnByb3RvdHlwZS5zZWxlY3RvcnNbL15cXHcrJC9dID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShwYXJhbSk7XG59O1xuXG4vLyBGaW5kIHNvbWUgaHRtbCBub2RlcyB1c2luZyBhbiBJZFxuJGUucHJvdG90eXBlLnNlbGVjdG9yc1svXlxcI1tcXHdcXC1dKyQvXSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFyYW0uc3Vic3RyaW5nKDEpKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0ICRlO1xuIiwiaW1wb3J0ICRlIGZyb20gJy4vJGUnO1xuaW1wb3J0IHtnZXRXaWR0aHN9IGZyb20gJy4vY2FsY3VsYXRpb25zJztcbmltcG9ydCAqIGFzIGNvbHMgZnJvbSAnLi9jb2x1bW5zJztcblxuY29uc3QgY2FsY3VsYXRlID0gKGN0eCwgcmVmcmVzaCA9IGZhbHNlLCBsb2FkZWQgPSB0cnVlKSA9PiB7XG4gIGxldCBjaGlsZHJlbiA9IHJlZnJlc2ggPyBjdHguY29udGFpbmVyLmNoaWxkcmVuIDogJGUoJzpzY29wZSA+ICo6bm90KFtkYXRhLW1hY3ktY29tcGxldGU9XCIxXCJdKScsIGN0eC5jb250YWluZXIpO1xuICBsZXQgZWxlV2lkdGggPSBnZXRXaWR0aHMoY3R4Lm9wdGlvbnMpO1xuXG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgaWYgKHJlZnJlc2gpIHtcbiAgICAgIGNoaWxkLmRhdGFzZXQubWFjeUNvbXBsZXRlID0gMDtcbiAgICB9XG4gICAgY2hpbGQuc3R5bGUud2lkdGggPSBlbGVXaWR0aDtcbiAgfSk7XG5cbiAgaWYgKGN0eC5vcHRpb25zLnRydWVPcmRlcikge1xuICAgIHJldHVybiBjb2xzLnNvcnQoY3R4LCBjaGlsZHJlbiwgcmVmcmVzaCwgbG9hZGVkKTtcbiAgfVxuXG4gIHJldHVybiBjb2xzLnNodWZmbGUoY3R4LCBjaGlsZHJlbiwgcmVmcmVzaCwgbG9hZGVkKVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRDb2x1bW5zIChvcHRpb25zKSB7XG4gIGxldCBkb2NXaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XG4gIGxldCBub09mQ29sdW1ucztcblxuICBmb3IgKGxldCB3aWR0aHMgaW4gb3B0aW9ucy5icmVha0F0KSB7XG4gICAgaWYgKGRvY1dpZHRoIDwgd2lkdGhzKSB7XG4gICAgICBub09mQ29sdW1ucyA9IG9wdGlvbnMuYnJlYWtBdFt3aWR0aHNdO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFub09mQ29sdW1ucykge1xuICAgIG5vT2ZDb2x1bW5zID0gb3B0aW9ucy5jb2x1bW5zO1xuICB9XG5cbiAgcmV0dXJuIG5vT2ZDb2x1bW5zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2lkdGhzIChvcHRpb25zLCBtYXJnaW5zSW5jbHVkZWQgPSB0cnVlKSB7XG4gIGxldCBub09mQ29sdW1ucyA9IGdldEN1cnJlbnRDb2x1bW5zKG9wdGlvbnMpO1xuICBsZXQgbWFyZ2lucztcbiAgbGV0IHdpZHRoID0gMTAwIC8gbm9PZkNvbHVtbnM7XG5cbiAgaWYgKCFtYXJnaW5zSW5jbHVkZWQpIHtcbiAgICByZXR1cm4gd2lkdGg7XG4gIH1cblxuICBpZiAobm9PZkNvbHVtbnMgPT09IDEpIHtcbiAgICByZXR1cm4gYDEwMCVgO1xuICB9XG5cbiAgbWFyZ2lucyA9IChub09mQ29sdW1ucyAtIDEpICogb3B0aW9ucy5tYXJnaW4gLyBub09mQ29sdW1ucztcbiAgcmV0dXJuIGBjYWxjKCR7d2lkdGh9JSAtICR7bWFyZ2luc31weClgO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExlZnRQb3NpdGlvbiAoY3R4LCBjb2wpIHtcbiAgbGV0IG5vT2ZDb2x1bW5zID0gZ2V0Q3VycmVudENvbHVtbnMoY3R4Lm9wdGlvbnMpO1xuICBsZXQgdG90YWxMZWZ0ID0gMDtcbiAgbGV0IG1hcmdpbiwgc3RyO1xuXG4gIGNvbCsrO1xuXG4gIGlmIChjb2wgPT09IDEpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIG1hcmdpbiA9IChjdHgub3B0aW9ucy5tYXJnaW4gLSAoKChub09mQ29sdW1ucyAtIDEpICogY3R4Lm9wdGlvbnMubWFyZ2luKSAvIG5vT2ZDb2x1bW5zKSkgKiAoY29sIC0gMSk7XG4gIHRvdGFsTGVmdCArPSBnZXRXaWR0aHMoY3R4Lm9wdGlvbnMsIGZhbHNlKSAqIChjb2wgLSAxKTtcbiAgc3RyID0gJ2NhbGMoJyArIHRvdGFsTGVmdCArICclICsgJyArIG1hcmdpbiArICdweCknO1xuXG4gIHJldHVybiBzdHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDb250YWluZXJIZWlnaHQgKGN0eCkge1xuICBsZXQgbGFyZ2VzdCA9IDA7XG4gIGxldCB7Y29udGFpbmVyLCByb3dzfSA9IGN0eDtcblxuICBmb3IgKHZhciBpID0gcm93cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGxhcmdlc3QgPSByb3dzW2ldID4gbGFyZ2VzdCA/IHJvd3NbaV0gOiBsYXJnZXN0O1xuICB9XG5cbiAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGAke2xhcmdlc3R9cHhgO1xufVxuIiwiaW1wb3J0IHtnZXRMZWZ0UG9zaXRpb24sIGdldEN1cnJlbnRDb2x1bW5zLCBnZXRXaWR0aHMsIHNldENvbnRhaW5lckhlaWdodH0gZnJvbSAnLi9jYWxjdWxhdGlvbnMnO1xuaW1wb3J0IHByb3AgZnJvbSAnLi4vaGVscGVycy9wcm9wJztcbmZ1bmN0aW9uIHNldFVwUm93cyAoY3R4LCBjb2xzLCByZWZyZXNoID0gZmFsc2UpIHtcblxuICBpZiAoIWN0eC5sYXN0Y29sKSB7XG4gICAgY3R4Lmxhc3Rjb2wgPSAwO1xuICB9XG5cbiAgLy8gUmVzZXQgcm93c1xuICBpZiAocmVmcmVzaCkge1xuICAgIGN0eC5yb3dzID0gW107XG4gICAgY3R4LmNvbHMgPSBbXTtcbiAgICBjdHgubGFzdGNvbCA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gY29scyAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjdHgucm93c1tpXSA9IDA7XG4gICAgICBjdHguY29sc1tpXSA9IGdldExlZnRQb3NpdGlvbihjdHgsIGkpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjdHgudG1wUm93cykge1xuICAgIGN0eC5yb3dzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gY29scyAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjdHgucm93c1tpXSA9IGN0eC50bXBSb3dzW2ldO1xuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIGN0eC50bXBSb3dzID0gW107XG4gICAgZm9yICh2YXIgaSA9IGNvbHMgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY3R4LnRtcFJvd3NbaV0gPSBjdHgucm93c1tpXTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGUgKGN0eCwgJGVsZXMsIHJlZnJlc2ggPSBmYWxzZSwgbWFya2FzQ29tcGxldGUgPSB0cnVlKSB7XG4gIGxldCBjb2xzID0gZ2V0Q3VycmVudENvbHVtbnMoY3R4Lm9wdGlvbnMpO1xuICBzZXRVcFJvd3MoY3R4LCBjb2xzLCByZWZyZXNoKTtcblxuICAkZWxlcy5mb3JFYWNoKChlbGUsIGtleSkgPT4ge1xuICAgIGxldCBzbWFsbGVzdCA9IDA7XG4gICAgbGV0IGVsZUhlaWdodCA9IHByb3AoZWxlLCAnaGVpZ2h0Jyk7XG4gICAgZWxlSGVpZ2h0ID0gcGFyc2VJbnQoZWxlSGVpZ2h0LnJlcGxhY2UoJ3B4JywgJycpLCAxMCk7XG5cbiAgICBpZiAoaXNOYU4oZWxlSGVpZ2h0KSkgcmV0dXJuO1xuXG4gICAgY3R4LnJvd3MuZm9yRWFjaCgodiwgaykgPT4ge1xuICAgICAgaWYgKHYgPCBjdHgucm93c1tzbWFsbGVzdF0pIHtcbiAgICAgICAgc21hbGxlc3QgPSBrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZWxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBlbGUuc3R5bGUudG9wID0gYCR7Y3R4LnJvd3Nbc21hbGxlc3RdfXB4YDtcbiAgICBlbGUuc3R5bGUubGVmdCA9IGAke2N0eC5jb2xzW3NtYWxsZXN0XX1gO1xuICAgIGN0eC5yb3dzW3NtYWxsZXN0XSArPSAhaXNOYU4oZWxlSGVpZ2h0KSA/IGVsZUhlaWdodCArIGN0eC5vcHRpb25zLm1hcmdpbiA6IDA7XG5cbiAgICBpZiAobWFya2FzQ29tcGxldGUpIHtcbiAgICAgIGVsZS5kYXRhc2V0Lm1hY3lDb21wbGV0ZSA9IDE7XG4gICAgfVxuICB9KTtcblxuICBpZiAobWFya2FzQ29tcGxldGUpIHtcbiAgICBjdHgudG1wUm93cyA9IG51bGw7XG4gIH1cblxuICBzZXRDb250YWluZXJIZWlnaHQoY3R4KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnQgKGN0eCwgJGVsZXMsIHJlZnJlc2ggPSBmYWxzZSwgbWFya2FzQ29tcGxldGUgPSB0cnVlKSB7XG4gIGxldCBjb2xzID0gZ2V0Q3VycmVudENvbHVtbnMoY3R4Lm9wdGlvbnMpO1xuICBzZXRVcFJvd3MoY3R4LCBjb2xzLCByZWZyZXNoKTtcblxuICAkZWxlcy5mb3JFYWNoKChlbGUsIGtleSkgPT4ge1xuXG4gICAgaWYgKGN0eC5sYXN0Y29sID09PSBjb2xzKSB7XG4gICAgICBjdHgubGFzdGNvbCA9IDA7XG4gICAgfVxuXG4gICAgbGV0IGVsZUhlaWdodCA9IHByb3AoZWxlLCAnaGVpZ2h0Jyk7XG4gICAgZWxlSGVpZ2h0ID0gcGFyc2VJbnQoZWxlSGVpZ2h0LnJlcGxhY2UoJ3B4JywgJycpLCAxMCk7XG5cbiAgICBpZiAoaXNOYU4oZWxlSGVpZ2h0KSkgcmV0dXJuO1xuICAgIGVsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZWxlLnN0eWxlLnRvcCA9IGAke2N0eC5yb3dzW2N0eC5sYXN0Y29sXX1weGA7XG4gICAgZWxlLnN0eWxlLmxlZnQgPSBgJHtjdHguY29sc1tjdHgubGFzdGNvbF19YDtcbiAgICBjdHgucm93c1tjdHgubGFzdGNvbF0gKz0gIWlzTmFOKGVsZUhlaWdodCkgPyBlbGVIZWlnaHQgKyBjdHgub3B0aW9ucy5tYXJnaW4gOiAwO1xuICAgIGN0eC5sYXN0Y29sICs9IDE7XG5cbiAgICBpZiAobWFya2FzQ29tcGxldGUpIHtcbiAgICAgIGVsZS5kYXRhc2V0Lm1hY3lDb21wbGV0ZSA9IDE7XG4gICAgfVxuICB9KTtcblxuICBpZiAobWFya2FzQ29tcGxldGUpIHtcbiAgICBjdHgudG1wUm93cyA9IG51bGw7XG4gIH1cblxuICBzZXRDb250YWluZXJIZWlnaHQoY3R4KTtcbn1cbiJdfQ==
