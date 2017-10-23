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

/* eslint-enable */

export default init;
