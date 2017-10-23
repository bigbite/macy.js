import {getLeftPosition, getCurrentColumns, getCurrentMargin, setContainerHeight} from './calculations';
import prop from '../helpers/prop';
import foreach from '../helpers/foreach';

/**
 * Sets up the required data for the shuffle and sort method
 * @param  {Macy}     ctx     - Macy Instance
 * @param  {Integer}  cols    - Number of columns
 * @param  {Boolean} refresh  - Should columns and rows be reset
 */
const setUpRows = (ctx, cols, refresh = false) => {
  if (!ctx.lastcol) {
    ctx.lastcol = 0;
  }

  if (ctx.rows.length < 1) {
    refresh = true;
  }

  // Reset rows
  if (refresh) {
    ctx.rows = [];
    ctx.cols = [];
    ctx.lastcol = 0;

    for (var i = cols - 1; i >= 0; i--) {
      ctx.rows[i] = 0;
      ctx.cols[i] = getLeftPosition(ctx, i);
    }

    return;
  }

  if (ctx.tmpRows) {
    ctx.rows = [];

    for (var i = cols - 1; i >= 0; i--) {
      ctx.rows[i] = ctx.tmpRows[i];
    }
    return
  }

  ctx.tmpRows = [];
  for (var i = cols - 1; i >= 0; i--) {
    ctx.tmpRows[i] = ctx.rows[i];
  }
}

/**
 * A Sorting method when trueOrder = false
 * @param  {Macy}      ctx              - Macy Instance
 * @param  {NodeList}  $eles            - Element List to sort
 * @param  {Boolean}   refresh          - Show all columns and rows be refreshed and recalculated
 * @param  {Boolean}   markasComplete   - Mark elements as complete
 */
export function shuffle (ctx, $eles, refresh = false, markasComplete = true) {
  let cols = getCurrentColumns(ctx.options);
  let margin = getCurrentMargin(ctx.options).y;
  setUpRows(ctx, cols, refresh);

  foreach($eles, (ele) => {
    let smallest = 0;
    let eleHeight = parseInt(ele.offsetHeight, 10);

    if (isNaN(eleHeight)) return;

    ctx.rows.forEach((v, k) => {
      if (v < ctx.rows[smallest]) {
        smallest = k;
      }
    });

    ele.style.position = 'absolute';
    ele.style.top = `${ctx.rows[smallest]}px`;
    ele.style.left = `${ctx.cols[smallest]}`;
    ctx.rows[smallest] += !isNaN(eleHeight) ? eleHeight + margin : 0;

    if (markasComplete) {
      ele.dataset.macyComplete = 1;
    }
  });

  if (markasComplete) {
    ctx.tmpRows = null;
  }

  setContainerHeight(ctx);
}

/**
 * A Sorting method when trueOrder = true
 * @param  {Macy}      ctx              - Macy Instance
 * @param  {NodeList}  $eles            - Element List to sort
 * @param  {Boolean}   refresh          - Show all columns and rows be refreshed and recalculated
 * @param  {Boolean}   markasComplete   - Mark elements as complete
 */
export function sort (ctx, $eles, refresh = false, markasComplete = true) {
  let cols = getCurrentColumns(ctx.options);
  let margin = getCurrentMargin(ctx.options).y;
  setUpRows(ctx, cols, refresh);

  foreach($eles, (ele) => {

    if (ctx.lastcol === cols) {
      ctx.lastcol = 0;
    }

    let eleHeight = prop(ele, 'height');
    eleHeight = parseInt(ele.offsetHeight, 10);

    if (isNaN(eleHeight)) return;
    ele.style.position = 'absolute';
    ele.style.top = `${ctx.rows[ctx.lastcol]}px`;
    ele.style.left = `${ctx.cols[ctx.lastcol]}`;
    ctx.rows[ctx.lastcol] += !isNaN(eleHeight) ? eleHeight + margin : 0;
    ctx.lastcol += 1;

    if (markasComplete) {
      ele.dataset.macyComplete = 1;
    }
  });

  if (markasComplete) {
    ctx.tmpRows = null;
  }

  setContainerHeight(ctx);
}
