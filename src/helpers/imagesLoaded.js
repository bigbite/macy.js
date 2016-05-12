import async from './async';

let imagesComplete = (during, after, data) => {
  if (during) {
    async(during);
  }

  if (data.req === data.complete) {
    async(after);
  }
}

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
