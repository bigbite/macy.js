import {getLeftPosition, getCurrentColumns, getWidths, setContainerHeight} from './calculations';
import prop from '../helpers/prop';
function setUpRows (ctx, cols, refresh = false) {

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
      ctx.cols[i] = getLeftPosition(ctx, i);
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

export function shuffle (ctx, $eles, refresh = false, markasComplete = true) {
  let cols = getCurrentColumns(ctx.options);
  setUpRows(ctx, cols, refresh);

  $eles.forEach((ele, key) => {
    let smallest = 0;
    let eleHeight = prop(ele, 'height');
    eleHeight = parseInt(eleHeight.replace('px', ''), 10);

    if (isNaN(eleHeight)) return;

    ctx.rows.forEach((v, k) => {
      if (v < ctx.rows[smallest]) {
        smallest = k;
      }
    });

    ele.style.position = 'absolute';
    ele.style.top = `${ctx.rows[smallest]}px`;
    ele.style.left = `${ctx.cols[smallest]}`;
    ctx.rows[smallest] += !isNaN(eleHeight) ? eleHeight + ctx.options.margin : 0;

    if (markasComplete) {
      ele.dataset.macyComplete = 1;
    }
  });

  if (markasComplete) {
    ctx.tmpRows = null;
  }

  setContainerHeight(ctx);
}

export function sort (ctx, $eles, refresh = false, markasComplete = true) {
  let cols = getCurrentColumns(ctx.options);
  setUpRows(ctx, cols, refresh);

  $eles.forEach((ele, key) => {

    if (ctx.lastcol === cols) {
      ctx.lastcol = 0;
    }

    let eleHeight = prop(ele, 'height');
    eleHeight = parseInt(eleHeight.replace('px', ''), 10);

    if (isNaN(eleHeight)) return;
    ele.style.position = 'absolute';
    ele.style.top = `${ctx.rows[ctx.lastcol]}px`;
    ele.style.left = `${ctx.cols[ctx.lastcol]}`;
    ctx.rows[ctx.lastcol] += !isNaN(eleHeight) ? eleHeight + ctx.options.margin : 0;
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
