//进行打包  monerepo  获取到 需要打包的包
// (1)获取 打包 目录

const execa = require('execa')

//2 进行打包  并行打包 
async function build(target){
 // 注意 execa  -c 执行rullup配置 ， 环境变量 -env  w
    await execa('rollup',['-cw',"--environment",`TARGET:${target}`],{stdio:'inherit'}) // 子进程的输出在父包中输出
}

build('reactivity')