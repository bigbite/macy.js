import foreach from '../helpers/foreach';
import { getResponsiveOptions } from '../helpers/getResponsiveOptions';

/**
 * Return the current number of columns macy should be
 * @param  {Object} options - Macy instance's options
 * @return {Integer}        - Number of columns
 */
export function getCurrentColumns (options) {
  let noOfColumns = getResponsiveOptions(options).columns;
  return noOfColumns;
}

/**
 * Return the current margin dimensions macy should use
 * @param  {Object} options - Macy instance's options
 * @return {Object}         - Object containing x & y margins
 */
export function getCurrentMargin (options) {
  let margin = getResponsiveOptions(options).margin;
  return margin;
}

/**
 * Get the width of each column based on the number of columns
 * @param  {Object} options           - Macy instance's options
 * @param  {Boolean} marginsIncluded  - Include margins into the calculations
 * @return {String}                   - The correct number css style for column width
 */
export function getWidths (options, marginsIncluded = true) {
  let noOfColumns = getCurrentColumns(options);
  let margins = getCurrentMargin(options).x;
  let width = 100 / noOfColumns;

  if (!marginsIncluded) {
    return width;
  }

  if (noOfColumns === 1) {
    return '100%';
  }

  margins = (noOfColumns - 1) * margins / noOfColumns;
  return `calc(${width}% - ${margins}px)`;
};

/**
 * Get the left position based on which column and column width
 * @param  {Macy}    ctx  - Macy instance
 * @param  {Integer} col  - Current Number of Columns
 * @return {String}       - The correct number css style for column position
 */
export function getLeftPosition (ctx, col) {
  let noOfColumns = getCurrentColumns(ctx.options);
  let totalLeft = 0;
  let margin, str, baseMargin;

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
export function setContainerHeight (ctx) {
  let largest = 0;
  let {container, rows} = ctx;

  foreach(rows, (row) => {
    largest = row > largest ? row : largest;
  });

  container.style.height = `${largest}px`;
}
