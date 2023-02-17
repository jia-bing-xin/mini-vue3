// 通过 rollup进行打包

//（1）引入相关依赖
import ts from 'rollup-plugin-typescript2' //解析  ts
import json from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve' //解析 第三方 插件
import path from 'path' // 处理路径

//（2）获取文件路径
let packagesDir = path.resolve(__dirname,'packages')

// 2.1 获取需要打包的包
const packageDir = path.resolve(packagesDir, process.env.TARGET)
//2.2 打包获取到 每个包的项目配置
const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`)) //获取 json
const name =  path.basename(packageDir)

//(3)创建一个表
const outputOpions ={
    "esm-bundler":{
       file:resolve(`dist/${name}.esm-bundler.js`) ,
       format:'es'
    },
    "cjs":{
        file:resolve(`dist/${name}.cjs.js`) ,
        format:'cjs'
     },
     "global":{
        file:resolve(`dist/${name}.global.js`) ,
        format:'iife'
     }
}
const options = pkg.buildOptions
function createConfig(format,output){
    //进行打包
    console.log()
    output.name = options.name
    output.sourcemap = true
    //生成rollup配置
    return  {
        input:resolve('src/index.ts'), //导入
        output,
        plugins:[
            json(),
            ts({ //解析 ts 
                tsconfig:path.resolve(__dirname,'tsconfig.json')
            }),
            resolvePlugin() //解析 第三方 插件
        ]
    }
  }
  
 //rullup 需要 导出一个配置
 export default options.formats.map(format=>createConfig(format,outputOpions[format]))