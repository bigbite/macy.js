/**
 * Return the current number of columns macy should be
 * @param  {Object} options - Macy instance's options
 * @return {Integer}        - Number of columns
 */
export function getCurrentColumns (options) {
  let docWidth = document.body.clientWidth;
  let noOfColumns;

  for (let widths in options.breakAt) {
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
export function getWidths (options, marginsIncluded = true) {
  let noOfColumns = getCurrentColumns(options);
  let margins;
  let width = 100 / noOfColumns;

  if (!marginsIncluded) {
    return width;
  }

  if (noOfColumns === 1) {
    return '100%';
  }

  margins = (noOfColumns - 1) * options.margin / noOfColumns;
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
  let margin, str;

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
export function setContainerHeight (ctx) {
  let largest = 0;
  let {container, rows} = ctx;

  for (var i = rows.length - 1; i >= 0; i--) {
    largest = rows[i] > largest ? rows[i] : largest;
  }

  container.style.height = `${largest}px`;
}
