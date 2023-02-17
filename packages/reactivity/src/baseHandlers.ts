// 实现 new  Proxy(target,baseHandlers) 里面有 get  set
//我们几种请求 ：
//1是不是只读的属性 :只读用set 时会报错
//2是不是深度 ：
//一创建get
import { extend } from '@vue/shared'
import { isObject } from '@vue/shared';
import {readonly,reative} from './reativeApi'
import {TrackOptypes} from './optionations'
import { Track} from './effect'
function createGetter(isReadonly = false, shallow = false) { //拦截获取的功能
    //返回值是一个函数
    return function get(target, key, receiver) { //let state = reative() state.name
        // proxy + Reflect(反射)
        const res = Reflect.get(target, key, receiver) //  target[key]
        //是不是只读
         if(!isReadonly){ //不是 只读
             //收集依赖，等数据变化后更新视图
             console.log('执行effect时取值 收集effect') 
             //现在vue3是不是很清楚， 我们的响应式数据 使用我们就收集对应的effect,(name,age)
             //收集effect    再源码中
             Track(target,TrackOptypes.GET,key)
            }
        //是不是浅的
        if(shallow){ //是浅的
               return res
        }
        //如果这个res 是一个对象  递归
        //vue2 以上来就是 递归吗， vue3是当取值会进行代理， 这种模式叫做懒代理
         if(isObject(res)){ //对象  {list:{n:100},name:"张三"}
           //判断  只读 
             return isReadonly? readonly(res):reative(res)

         }
        return res
    }
}
//二set  设置
function createSetter(shallow = false) { //拦截设置的功能
    return function set(target, key, value, receiver) {  //state.name = 100
        const result = Reflect.set(target, key, value, receiver) // target[key] = value
           //当数据更新时候 通知对应属性的effect重新执行
           // 我们要区分是新增的 还是 修改的  vue2 里无法监控更改索引，无法监控数组的长度变化
           // =》 hack的方法  需要特殊处理
       
    
        return result
    }
}
const get = createGetter()
const shallowReactiveGet = createGetter(false, true)
const reandonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)


const set = createSetter()
const shallowSet = createSetter(true)
export const reativeHandlers = {
    get,
    set
}
export const shallowReativeHandlers = {
    get: shallowReactiveGet,
    set: shallowSet
}
// 进行合拼  
let readonlyObj = {
    set: (target, key) => {
        console.warn(`set ${target} on key ${key} falied`)
    }
}
export const readonlyHandlers = extend({
    get: reandonlyGet,

}, readonlyObj)
export const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet,

}, readonlyObj)



