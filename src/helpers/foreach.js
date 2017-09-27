const foreach = (iterable, callback) => {
  let i = iterable.length, len = i;

  while (i--) {
    callback(iterable[len - i - 1])
  }
};

export default foreach;
