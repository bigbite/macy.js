let async = (fn, cb) => {
  setTimeout(() => {
    let x = fn();
    if (cb) {
      cb(x);
    }
  }, 0);
}

export default async;
