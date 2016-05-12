export function wait (func, delta) {
  let to;

  return function () {
    if (to) {
      clearTimeout(to);
    }

    to = setTimeout(func, delta);
  };
};
