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

export function getWidths (options, marginsIncluded = true) {
  let noOfColumns = getCurrentColumns(options);
  let margins;
  let width = 100 / noOfColumns;

  if (!marginsIncluded) {
    return width;
  }

  if (noOfColumns === 1) {
    return `100%`;
  }

  margins = (noOfColumns - 1) * options.margin / noOfColumns;
  return `calc(${width}% - ${margins}px)`;
};

export function getLeftPosition (ctx, col) {
  let noOfColumns = getCurrentColumns(ctx.options);
  let totalLeft = 0;
  let margin, str;

  col++;

  if (col === 1) {
    return 0;
  }

  margin = (ctx.options.margin - (((noOfColumns - 1) * ctx.options.margin) / noOfColumns)) * (col - 1);
  totalLeft += getWidths(ctx.options, false) * (col - 1);
  str = 'calc(' + totalLeft + '% + ' + margin + 'px)';

  return str;
}

export function setContainerHeight (ctx) {
  let largest = 0;
  let {container, rows} = ctx;

  for (var i = rows.length - 1; i >= 0; i--) {
    largest = rows[i] > largest ? rows[i] : largest;
  }

  container.style.height = `${largest}px`;
}
