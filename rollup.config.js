import NodeResolve from 'rollup-plugin-node-resolve';

const baseConfig = format => ({
	input: 'lib/index.js',
	output: {
		file: `dist/reshetaw.${format}.js`,
		name: 'reshetaw',
		format,
	},
	plugins: [NodeResolve()]
});

export default [
	'amd', 'cjs', 'esm'
].map(baseConfig);
