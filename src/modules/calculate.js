import $e from './$e';
import {getWidths} from './calculations';
import * as cols from './columns';
import foreach from '../helpers/foreach';

/**
 * Calculates the column widths and positions dependant on options.
 * @param  {Macy}  ctx       - Macy instance
 * @param  {Boolean} refresh - Should calculate recalculate all elements
 * @param  {Boolean} loaded  - Should all elements be marked as complete
 */
const calculate = (ctx, refresh = false, loaded = true) => {
  let children = refresh ? ctx.container.children : $e(':scope > *:not([data-macy-complete="1"])', ctx.container);
  let eleWidth = getWidths(ctx.options);

  foreach(children, (child) => {
    if (refresh) {
      child.dataset.macyComplete = 0;
    }
    child.style.width = eleWidth;
  });

  if (ctx.options.trueOrder) {
    cols.sort(ctx, children, refresh, loaded);
    return ctx.emit(ctx.constants.EVENT_RECALCULATED);//cols.sort(ctx, children, refresh, loaded);
  }

  cols.shuffle(ctx, children, refresh, loaded);
  return ctx.emit(ctx.constants.EVENT_RECALCULATED); //cols.shuffle(ctx, children, refresh, loaded);
};

export default calculate;
