/*!
 * Macy.js v1.1.2 - Macy is a lightweight, dependency free, masonry layout library
 * Author: Copyright (c) Big Bite Creative <@bigbitecreative> <http://bigbitecreative.com>
 * Url: http://macyjs.com/
 * License: MIT
 */
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], function() {
      return factory();
    });
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.Macy = factory();
  }
})(this, function() {
  "use strict";
  var extend = function(objects) {
    var extended = {};
    var i = 1;
    var prop;
    var merge = function(obj) {
      for (prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (Object.prototype.toString.call(obj[prop]) === "[object Object]") {
            extended[prop] = extend(extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
    merge(arguments[0]);
    for (i = 1; i < arguments.length; i++) {
      var obj = arguments[i];
      merge(obj);
    }
    return extended;
  };
  var Macy = {};
  Macy.VERSION = "1.1.2";
  Macy.settings = {};
  var defaults = {
    columns: 3,
    margin: 2,
    trueOrder: true,
    waitForImages: false
  };
  var cache = {
    options: {}
  };
  var imgsRequired, currentlyLoaded;
  var getCurrentColumns = function() {
    var docWidth = document.body.clientWidth;
    var noOfColumns;
    for (var widths in cache.options.breakAt) {
      if (docWidth < widths) {
        noOfColumns = cache.options.breakAt[widths];
        break;
      }
    }
    if (!noOfColumns) {
      noOfColumns = cache.options.columns;
    }
    return noOfColumns;
  };
  var getColumnWidths = function(marginIncluded) {
    marginIncluded = typeof marginIncluded !== "undefined" ? marginIncluded : true;
    var noOfColumns = getCurrentColumns();
    var margins;
    if (!marginIncluded) {
      return 100 / noOfColumns;
    }
    if (noOfColumns === 1) {
      return 100 + "%";
    }
    margins = (noOfColumns - 1) * cache.options.margin / noOfColumns;
    return "calc(" + 100 / noOfColumns + "% - " + margins + "px)";
  };
  var setWidths = function() {
    var percentageWidth = getColumnWidths();
    each(cache.elements, function(index, val) {
      val.style.width = percentageWidth;
      val.style.position = "absolute";
    });
  };
  var getLeftValue = function(col) {
    var noOfColumns = getCurrentColumns();
    var totalLeft = 0;
    var margin, str;
    col++;
    if (col === 1) {
      return 0;
    }
    margin = (cache.options.margin - (noOfColumns - 1) * cache.options.margin / noOfColumns) * (col - 1);
    totalLeft += getColumnWidths(false) * (col - 1);
    str = "calc(" + totalLeft + "% + " + margin + "px)";
    return str;
  };
  var getTopValue = function(row, col, eles) {
    var totalHeight = 0;
    var tempHeight;
    if (row === 0) {
      return 0;
    }
    for (var i = 0; i < row; i++) {
      tempHeight = parseInt(getProperty(cache.elements[eles[i]], "height").replace("px", ""), 10);
      totalHeight += isNaN(tempHeight) ? 0 : tempHeight + cache.options.margin;
    }
    return totalHeight;
  };
  var reOrder = function(columns) {
    var col = 0;
    var elements2d = [];
    var tempIndexs = [];
    var indexArray = [];
    each(cache.elements, function(index) {
      col++;
      if (col > columns) {
        col = 1;
        elements2d.push(tempIndexs);
        tempIndexs = [];
      }
      tempIndexs.push(index);
    });
    elements2d.push(tempIndexs);
    for (var i = 0, elements2dLen = elements2d.length; i < elements2dLen; i++) {
      var eleIndexs = elements2d[i];
      for (var j = 0, eleIndexsLen = eleIndexs.length; j < eleIndexsLen; j++) {
        indexArray[j] = typeof indexArray[j] === "undefined" ? [] : indexArray[j];
        indexArray[j].push(eleIndexs[j]);
      }
    }
    cache.rows = indexArray;
    setPosition(false);
  };
  var shuffleOrder = function(columns) {
    var eles = cache.elements;
    var element2dArray = [];
    var overflowEles = [];
    for (var i = 0; i < columns; i++) {
      element2dArray[i] = [];
    }
    for (var k = 0; k < eles.length; k++) {
      overflowEles.push(k);
    }
    for (var v = 0, overflowElesLen = overflowEles.length; v < overflowElesLen; v++) {
      var index = findIndexOfSmallestTotal(element2dArray);
      element2dArray[index] = typeof element2dArray[index] === "undefined" ? [] : element2dArray[index];
      element2dArray[index].push(overflowEles[v]);
    }
    cache.rows = element2dArray;
    setPosition(true);
  };
  var setPosition = function(alternate) {
    alternate = alternate || false;
    var eles = cache.elements;
    var element2dArray = cache.rows;
    for (var i = 0, element2dArrayLen = element2dArray.length; i < element2dArrayLen; i++) {
      var rowArray = alternate ? bubbleSort(element2dArray[i]) : element2dArray[i];
      for (var j = 0, rowArrayLen = rowArray.length; j < rowArrayLen; j++) {
        var left, top;
        left = getLeftValue(i);
        top = getTopValue(j, i, rowArray, alternate);
        eles[rowArray[j]].style.top = top + "px";
        eles[rowArray[j]].style.left = left;
      }
    }
  };
  var findIndexOfSmallestTotal = function(arr) {
    var runningTotal = 0;
    var smallestIndex, smallest, lastSmall, tempHeight;
    for (var i = 0, arrLen = arr.length; i < arrLen; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        tempHeight = parseInt(getProperty(cache.elements[arr[i][j]], "height").replace("px", ""), 10);
        runningTotal += isNaN(tempHeight) ? 0 : tempHeight;
      }
      lastSmall = smallest;
      smallest = smallest === undefined ? runningTotal : smallest > runningTotal ? runningTotal : smallest;
      if (lastSmall === undefined || lastSmall > smallest) {
        smallestIndex = i;
      }
      runningTotal = 0;
    }
    return smallestIndex;
  };
  var getProperty = function(element, value) {
    return window.getComputedStyle(element, null).getPropertyValue(value);
  };
  var findLargestColumn = function() {
    var arr = cache.rows;
    var highest = 0, runningTotal = 0;
    for (var i = 0, arrLen = arr.length; i < arrLen; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        runningTotal += parseInt(getProperty(cache.elements[arr[i][j]], "height").replace("px", ""), 10);
        runningTotal += j !== 0 ? cache.options.margin : 0;
      }
      highest = highest < runningTotal ? runningTotal : highest;
      runningTotal = 0;
    }
    return highest;
  };
  var recalculate = function() {
    var columns = getCurrentColumns();
    if (columns === 1) {
      cache.container.style.height = "auto";
      each(cache.elements, function(index, ele) {
        ele.removeAttribute("style");
      });
      return;
    }
    setWidths();
    cache.elements = cache.container.children;
    if (!cache.options.trueOrder) {
      shuffleOrder(columns);
      setContainerHeight();
      return;
    }
    reOrder(columns);
    setContainerHeight();
  };
  var setContainerHeight = function() {
    cache.container.style.height = findLargestColumn() + "px";
  };
  var bubbleSort = function(list) {
    var arr = list;
    var n = arr.length - 1;
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        if (arr[j] > arr[j + 1]) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  };
  var ele = function(selector) {
    return document.querySelector(selector);
  };
  var eles = function(selector) {
    var nl = document.querySelectorAll(selector);
    var arr = [];
    for (var i = nl.length - 1; i >= 0; i--) {
      if (nl[i].offsetParent !== null) {
        arr.unshift(nl[i]);
      }
    }
    return arr;
  };
  var each = function(arr, func) {
    for (var i = 0, arrLen = arr.length; i < arrLen; i++) {
      func(i, arr[i]);
    }
  };
  var imagesLoaded = function(during, after) {
    during = during || false;
    after = after || false;
    if (typeof during === "function") {
      during();
    }
    if (currentlyLoaded >= imgsRequired && typeof after === "function") {
      after();
    }
  };
  var remove = function() {
    each(cache.container.children, function(index, ele) {
      ele.removeAttribute("style");
    });
    cache.container.removeAttribute("style");
    window.removeEventListener("resize", recalculate);
  };
  var calculateOnImageLoad = function(during, after) {
    var imgs = eles("img");
    imgsRequired = imgs.length - 1;
    currentlyLoaded = 0;
    each(imgs, function(i, img) {
      if (img.complete) {
        currentlyLoaded++;
        imagesLoaded(during, after);
        return;
      }
      img.addEventListener("load", function() {
        currentlyLoaded++;
        imagesLoaded(during, after);
      });
      img.addEventListener("error", function() {
        imgsRequired--;
        imagesLoaded(during, after);
      });
    });
  };
  Macy.init = function(options) {
    if (!options.container) {
      return;
    }
    cache.container = ele(options.container);
    if (!cache.container) {
      return;
    }
    delete options.container;
    cache.options = extend(defaults, options);
    window.addEventListener("resize", recalculate);
    cache.container.style.position = "relative";
    cache.elements = cache.container.children;
    if (!cache.options.waitForImages) {
      recalculate();
      calculateOnImageLoad(function() {
        recalculate();
      });
      return;
    }
    calculateOnImageLoad(null, function() {
      recalculate();
    });
  };
  Macy.recalculate = recalculate;
  Macy.onImageLoad = calculateOnImageLoad;
  Macy.remove = remove;
  return Macy;
});