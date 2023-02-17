//进行打包 monerepo 获取到需要打包

//(1)获取打包目录
const fs = require('fs')
//保证packages的目录下的文件是文件夹--isDirectory()
const dirs = fs.readdirSync('packages').filter(item => fs.statSync(`packages/${item}`).isDirectory())
console.log(dirs)

//(2)进行并行打包
const execa = require('execa')
const build = async(target)=>{
    console.log(target,execa)
    //注意execa -c执行rullup配置,环境变量-env
    await execa('rollup',["-c","--environment",`TARGET:${target}`],{stdio:'inherit'})// 子进程的输出在父包中输出
}
//等待所有打包文件完成
const runParaller = async(dirs,itemfn)=>{
    let result = []
    dirs.forEach(item => {
        result.push(itemfn(item))
    })
    return Promise.all(result)
}
runParaller(dirs,build).then(()=>{
    console.log('成功')
}).catch(()=>{
    console.log('失败')
})