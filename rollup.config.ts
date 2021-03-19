import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { eslint } from 'rollup-plugin-eslint';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import uglify from 'rollup-plugin-uglify-es';

const banner = require('./config/banner');
const pack = require('./package.json');

function toUpper (_, c) {
  return c ? c.toUpperCase() : '';
}

function classify (str) {
  return str.replace(/(?:^|[-_\/])(\w)/g, toUpper);
}

const moduleName = classify(pack.name);

const plugins = [
  resolve(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'production'
    ),
    '__NAME__': pack.name,
    '__VERSION__': pack.version,
  }),
  eslint({
    throwOnError: true,
  }),
  typescript(),
  commonjs(),
  copy({
    targets: {
      'src/types.ts': `dist/${pack.name}.d.ts`,
    },
  }),
];

export default [
  {
    input: 'src/index.ts',
    plugins,
    output: {
      file: `dist/${pack.name}.common.js`,
      format: 'cjs',
      banner,
    },
  },
  {
    input: 'src/index.ts',
    plugins,
    output: {
      file: `dist/${pack.name}.esm.js`,
      format: 'es',
      banner,
    },
  },
  {
    input: 'src/index.ts',
    plugins: plugins.concat(uglify()),
    output: {
      file: `dist/${pack.name}.min.js`,
      format: 'umd',
      banner,
      name: moduleName,
    },
  },
  {
    input: 'src/index.ts',
    plugins,
    output: {
      file: `dist/${pack.name}.js`,
      format: 'umd',
      banner,
      name: moduleName,
    },
  },
];
