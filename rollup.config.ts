import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { eslint } from 'rollup-plugin-eslint';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
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
];

function makeEntry(options) {
  return {
    input: 'src/index.ts',
    plugins: options.plugins || plugins,
    output: {
      file: `dist/${pack.name}${options.extension}`,
      format: options.format,
      banner,
      name: options.name || undefined,
    },
  };
}

export default [
  makeEntry({
    extension: '.common.js',
    format: 'cjs',
  }),
  makeEntry({
    extension: '.esm.js',
    format: 'es',
  }),
  makeEntry({
    extension: '.min.js',
    format: 'umd',
    plugins: [...plugins, uglify()],
    name: moduleName,
  }),
  makeEntry({
    extension: '.js',
    format: 'umd',
    name: moduleName,
  }),
];
