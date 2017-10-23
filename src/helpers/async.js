/**
 * A hacky way to make a function asynchronous
 * @param  {Function} fn  - The Function to be ran asynchronously
 * @param  {Function} cb  - A optional function that runs after fn
 */
const async = (fn, cb) => {
  setTimeout(() => {
    let x = fn();
    if (cb) {
      cb(x);
    }
  }, 0);
}

export default async;
