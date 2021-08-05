import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'src/macy.js',
		output: {
			name: 'Macy',
			banner: '/* Macy.js - v2.5.1 - @bigbite  */',
			file: pkg.browser,
			format: 'umd',
			minifyInternalExports: true,
		},
		plugins: [
			terser()
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/macy.js',
		output: [
			{ exports: 'auto', file: "demo/assets/js/macy.js", format: "umd", name: 'Macy' },
			{ exports: 'auto', file: "dist/macy.dev.js", format: "cjs" },
			{ exports: 'auto', file: "dist/macy.js", format: "cjs", plugins: [terser()] },
			{ exports: 'auto', file: "dist/macy.esm.js", format: "esm" },
		  ],
	}
];
