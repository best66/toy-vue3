import ts from 'rollup-plugin-typescript2';
import resolvePlugin from '@rollup/plugin-node-resolve';
import path from 'path';

let packagesDir = path.resolve(__dirname, 'packages');
let packageDir = path.resolve(packagesDir, process.env.TARGET);

const resolve = (p) => path.resolve(packageDir, p);

const pkg = require(resolve('package.json'));

const packageOptions = pkg.buildOptions;

const name = path.basename(packageDir);

const outputConfig = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es'
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs'
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife'
  }
};

function createConfig(format, output) {
  output.name = packageOptions.name;
  output.sourcemap = true;
  return {
    input: resolve(`src/index.ts`),
    output,
    plugins: [
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      }),
      resolvePlugin()
    ],
    onwarn: (msg, warn) => {
      // 忽略 Circular 的错误
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    }
  };
}

export default packageOptions.formats.map((format) => createConfig(format, outputConfig[format]));
