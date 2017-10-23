const foreach = (iterable, callback) => {
  let i = iterable.length, len = i;

  while (i--) {
    callback(iterable[len - i - 1])
  }
};

export function map (iterable, callback) {
  let i = iterable.length, len = i;
  let returns = [];


  while (i--) {
    returns.push(callback(iterable[len - i - 1]));
  }

  return returns;
}

export default foreach;
