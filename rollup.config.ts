import typescript from 'rollup-plugin-typescript';
import tslint from 'rollup-plugin-tslint';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';

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
  commonjs(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'production'
    ),
    '__NAME__': pack.name,
    '__VERSION__': pack.version,
  }),
  copy({
    targets: {
      'src/types.ts': `dist/${pack.name}.d.ts`,
    },
  }),
  typescript(),
  tslint({
    throwOnError: true,
  }),
];

export default [
  {
    input: 'src/index.ts',
    plugins,
    external: ['object-assign'],
    output: {
      file: `dist/${pack.name}.common.js`,
      format: 'cjs',
      banner,
      globals: {
        'object-assign': 'objectAssign',
      },
    },
  },
  {
    input: 'src/index.ts',
    plugins,
    external: ['object-assign'],
    output: {
      file: `dist/${pack.name}.esm.js`,
      format: 'es',
      banner,
      globals: {
        'object-assign': 'objectAssign',
      },
    },
  },
  {
    input: 'src/index.ts',
    plugins,
    external: ['object-assign'],
    output: {
      file: `dist/${pack.name}.min.js`,
      format: 'umd',
      banner,
      globals: {
        'object-assign': 'objectAssign',
      },
      name: moduleName,
      compact: true,
    },
  },
  {
    input: 'src/index.ts',
    plugins,
    external: ['object-assign'],
    output: {
      file: `dist/${pack.name}.js`,
      format: 'umd',
      banner,
      globals: {
        'object-assign': 'objectAssign',
      },
      name: moduleName,
    },
  },
];
