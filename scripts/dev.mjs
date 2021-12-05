import { execa } from 'execa';

async function build(target) {
  //c config w watch
  await execa(`rollup`, [`-cw`, `--environment`, `TARGET:${target}`], { stdio: 'inherit' });
}

build('reactivity');
