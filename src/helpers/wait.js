/**
 * Waits until wait stops being called before calling desired function
 * @param  {Function} func  - Function to run after the Wait stops being called
 * @param  {Integer}  delta - Time to wait after wait call to run the function
 * @return {Function}       - function that runs the desired function after it has stopped being called
 */
export function wait (func, delta) {
  let to;

  return function () {
    if (to) {
      clearTimeout(to);
    }

    to = setTimeout(func, delta);
  };
};
