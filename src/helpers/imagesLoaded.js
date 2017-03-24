import async from './async';

/**
 * This function calls the during and after function
 * @param  {Function} during - A function to be ran on each image load
 * @param  {Function} after  - A function to be ran once all images are loaded
 * @param  {Object} data     - An object containing number of complete images and number of loaded
 */
let imagesComplete = (during, after, data) => {
  if (during) {
    async(during);
  }

  if (data.req === data.complete) {
    async(after);
  }
}

/**
 * Checks through all images and runs the function on complete images
 * @param  {NodeList} imgs   - Image Elements
 * @param  {Function} during - Function to on each image load
 * @param  {Function} after  - Function to run once all images loaded
 */
let imagesLoaded = (imgs, during, after) => {
  let imgLen = imgs.length;
  let imgComplete = 0;

  imgs.forEach((img) => {
    if (img.complete) {
      imgComplete++;
      imagesComplete(during, after, {
        req: imgLen,
        complete: imgComplete
      });
    }

    img.addEventListener('load', () => {
      imgComplete++;
      imagesComplete(during, after, {
        req: imgLen,
        complete: imgComplete
      });
    });
  });
};


export default imagesLoaded;
