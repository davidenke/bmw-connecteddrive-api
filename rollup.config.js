import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { dependencies, main } from './package.json';

export default {
  input: 'src/index.ts', // our source file
  output: {
    file: main,
    format: 'cjs',
  },
  external: [...Object.keys(dependencies || {})],
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
  ],
};
