import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/macy.js',
  format: 'umd',
  moduleName: 'Macy',
  plugins: [
    babel(),
    uglify()
  ],
  dest: 'dist/macy.js'
};
