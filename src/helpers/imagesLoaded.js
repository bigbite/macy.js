import { map } from './foreach';

/**
 * Checks if an image has loaded by checking the height and width
 * @param img {Node} - Image element
 */
const imageHasLoaded = (img) => !('naturalHeight' in img && img.naturalHeight + img.naturalWidth === 0) || img.width + img.height !== 0;

/**
 * Returns a promise the emits events to macy context if loaded/errors
 * @param ctx {Object} - Macy instance
 * @param image {Node} - Image Element
 * @param emitOnLoad {Boolean} - Should promise fire image load event
 * @returns {Promise}
 */
const promise = (ctx, image, emitOnLoad = false) => {
  return new Promise((resolve, reject) => {
    if (image.complete) {

      if (!imageHasLoaded(image)) {
        return reject(image);
      }

      return resolve(image);
    }

    image.addEventListener('load', () => {
      if (imageHasLoaded(image)) {
        return resolve(image);
      }

      return reject(image);
    });

    image.addEventListener('error', () => {
      return reject(image);
    });
  }).then((img) => {
    if (emitOnLoad) {
      ctx.emit(ctx.constants.EVENT_IMAGE_LOAD, { img })
    }
  }).catch((img) => ctx.emit(ctx.constants.EVENT_IMAGE_ERROR, { img }));
};

/**
 * Returns an array of promises for images loaded
 * @param ctx {Object} - Macy instance
 * @param images {NodeList}
 * @param emitOnLoad {Boolean} - Should promise fire image load event
 * @returns {Array}
 */
const getImagePromises = (ctx, images, emitOnLoad = false) => {
  return map(images, (image) => promise(ctx, image, emitOnLoad));
};

/**
 * Returns a promise that emits an images complete event when all images are loaded.
 * @param ctx {Object} - Macy instance
 * @param images {NodeList}
 * @param emitOnLoad {Boolean} - Should promise fire image load event
 */
const imageLoaderPromise = (ctx, images, emitOnLoad = false) => Promise.all(getImagePromises(ctx, images, emitOnLoad)).then(() => {
  ctx.emit(ctx.constants.EVENT_IMAGE_COMPLETE);
});

/**
 * Sets up the image loading promise.
 * @param ctx {Object} - Macy instance
 * @param imgs {NodeList}
 * @param during {Boolean} - Should promise fire image load event
 */
export function imagesLoadedNew (ctx, imgs, during = false) {
  imageLoaderPromise(ctx, imgs, during);
}
