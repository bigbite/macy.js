import isObject from './isObject';

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
    }
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
export function getOptionsAsMobileFirst ({ options, responsiveOptions, keys, docWidth }) {
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
export function getOptionsAsDesktopFirst ({ options, responsiveOptions, keys, docWidth }) {
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
export function getResponsiveOptions (options) {
  let docWidth = document.body.clientWidth;
  let responsiveOptions = {
    columns: options.columns,
  };

  if (!isObject(options.margin)) {
    responsiveOptions.margin = {
      x: options.margin,
      y: options.margin
    }
  } else {
    responsiveOptions.margin = {
      x: options.margin.x,
      y: options.margin.y
    }
  }

  let keys = Object.keys(options.breakAt);

  if (options.mobileFirst) {
    return getOptionsAsMobileFirst({ options, responsiveOptions, keys, docWidth });
  }

  return getOptionsAsDesktopFirst({ options, responsiveOptions, keys, docWidth });
}
