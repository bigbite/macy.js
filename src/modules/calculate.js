import $e from './$e';
import {getWidths} from './calculations';
import * as cols from './columns';

/**
 * Calculates the column widths and postitions dependant on options.
 * @param  {Macy}  ctx       - Macy instance
 * @param  {Boolean} refresh - Should calculate recalculate all elements
 * @param  {Boolean} loaded  - Should all elements be marked as compelete
 */
const calculate = (ctx, refresh = false, loaded = true) => {
  let children = refresh ? ctx.container.children : $e(':scope > *:not([data-macy-complete="1"])', ctx.container);
  let eleWidth = getWidths(ctx.options);

  children.forEach((child) => {
    if (refresh) {
      child.dataset.macyComplete = 0;
    }
    child.style.width = eleWidth;
  });

  if (ctx.options.trueOrder) {
    return cols.sort(ctx, children, refresh, loaded);
  }

  return cols.shuffle(ctx, children, refresh, loaded)
};

export default calculate;
