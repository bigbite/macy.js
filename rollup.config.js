
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import eslint from 'rollup-plugin-eslint';

let umd = {
  input: 'src/macy.js',
  output: {
    file: 'dist/macy.js',
    format: 'umd',
    name: 'Macy',
    banner: '/* Macy.js - v2.3.0 */',
  },
  plugins: [
    eslint(),
    babel(),
  ]
};

let es = {
  input: 'src/macy.js',
  output: {
    file: 'dist/macy.es.js',
    format: 'es',
    name: 'Macy',
    banner: '/* Macy.js - v2.3.0 */',
  },
  plugins: [
    eslint(),
    babel(),
  ]
};

if (process.env.build !== 'dev') {
  umd.plugins.push(uglify());
}

export default [umd, es];
