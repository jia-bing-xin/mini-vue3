import { extend, isArray, isIntegerKey, hasOwn, isObject, } from '@vue/shared'
import {readonly,reative} from './reativeApi'
import { TrackOptypes, TriggerOpTypes, haseChange } from './optionations'
import { Track, trigger } from './effect'
function createGetter(isReadonly = false, shallow = false) { //拦截获取的功能
    return function get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver) // 函数形式：相当于target[key] = value
         if(!isReadonly){ 
             //收集依赖，等数据变化后更新视图
             console.log('执行effect时取值 收集effect') 
             //收集effect
             Track(target,TrackOptypes.GET,key)
            }
        if(shallow){
               return res
        }
        //懒代理---当取值会进行代理
         if(isObject(res)){
            return isReadonly? readonly(res):reative(res)
         }
        return res
    }
}
//二set  设置
function createSetter(shallow = false) { //拦截设置的功能
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver) // 函数形式：相当于target[key] = value
        //(1) 获取老值
        const oldValue = target[key]
        //2判断新增：false 还是 修改：true
        let haskey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)
        if (!haskey) {
            trigger(target, TriggerOpTypes.ADD, key, value)
        } else {
            if (!haseChange(value, oldValue)) {
                trigger(target, TriggerOpTypes.SET, key, value, oldValue)
            }
        }
        return result
    }
}
const get = createGetter()
const shallowReactiveGet = createGetter(false, true)
const reandonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

//是否是深的
const set = createSetter()
const shallowSet = createSetter(true)
//只读:用set 时会报错  
let readonlySet = {
    set: (target, key) => {
        console.warn(`set ${target} on key ${key} falied`)
    }
}
export const reativeHandlers = {
    get,
    set
}
export const shallowReativeHandlers = {
    get: shallowReactiveGet,
    set: shallowSet
}

export const readonlyHandlers = extend({
    get: reandonlyGet,

}, readonlySet)

export const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet,

}, readonlySet)



