// 针对 monorepo 编译项目

import fs from 'fs';
import {execa} from 'execa';

const dirs =  fs.readdirSync('packages').filter(p=> {
  return fs.statSync(`packages/${p}`).isDirectory()
})

// 并行打包
async function build(target) {
  await execa(`rollup`, [`-c`,`--environment`,`TARGET:${target}`],{stdio: 'inherit'})
}
async function runParllel(dirs,iterFn) {
  let result = []
  for (let item of dirs) {
    result.push(iterFn(item))
  }
  return Promise.all(result)
}

runParllel(dirs,build).then(()=> {
  console.log('ok')
})