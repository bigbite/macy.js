import { wait } from '../helpers/wait';
import Queue from './queue';
import EventsManager from './events';
import $e from './$e';
import { imagesLoadedNew } from '../helpers/imagesLoaded';

/**
 * create a resize event that adds recalculate to the event queue;
 * @param ctx {Object} - Macy instance
 */
const createResizeEvent = (ctx) => wait(() => {
  ctx.emit(ctx.constants.EVENT_RESIZE);
  ctx.queue.add(() => ctx.recalculate(true, true));
}, 100);

/**
 * Setup the containing element with the correct styles and attaches it to the macy instance
 * @param ctx {Object} - Macy instance
 */
const setupContainer = (ctx) => {
  // this.options = opts;
  ctx.container = $e(ctx.options.container);

  // Checks if container element exists
  if (ctx.container instanceof $e || !ctx.container) {
    return ctx.options.debug ? console.error('Error: Container not found') : false;
  }

  // Remove container selector from the options
  delete ctx.options.container;

  if (ctx.container.length) {
    ctx.container = ctx.container[0];
  }

  ctx.container.style.position = 'relative';
};

/**
 * Generates the basic state objects for macy to run
 * @param ctx {Object} - Macy instance
 */
const setupState = (ctx) => {
  ctx.queue = new Queue();
  ctx.events = new EventsManager(ctx);
  ctx.rows = [];
  ctx.resizer = createResizeEvent(ctx);
};

/**
 * Sets up event listeners for resize and image loading (if required)
 * @param ctx {Object} - Macy instance
 */
const setupEventListeners = (ctx) => {
  let imgs = $e('img', ctx.container);

  window.addEventListener('resize', ctx.resizer);
  ctx.on(ctx.constants.EVENT_IMAGE_LOAD, () => ctx.recalculate(false, false));
  ctx.on(ctx.constants.EVENT_IMAGE_COMPLETE, () => ctx.recalculate(true, true));

  if (!ctx.options.useOwnImageLoader) {
    imagesLoadedNew(ctx, imgs, !ctx.options.waitForImages);
  }

  ctx.emit(ctx.constants.EVENT_INITIALIZED);
};

const setup = (ctx) => {
  setupContainer(ctx);
  setupState(ctx);
  setupEventListeners(ctx);
};

export default setup;
