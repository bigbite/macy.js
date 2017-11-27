
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import eslint from 'rollup-plugin-eslint';

let buildObj = {
  entry: 'src/macy.js',
  format: 'umd',
  moduleName: 'Macy',
  banner: '/* Macy.js - v2.3.0 */',
  plugins: [
    eslint(),
    babel(),
  ],
  dest: 'dist/macy.js'
};

if (process.env.build !== 'dev') {
  buildObj.plugins.push(uglify());
}

export default buildObj;
