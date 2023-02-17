import { isObject } from "@vue/shared";

//四个api 各子的处理方法
import {
    reativeHandlers,
    shallowReativeHandlers,
    readonlyHandlers,
    shallowReadonlyHandlers
} from './baseHandlers'
export function reative(target) {
 
    return createReativeObject(target, false, reativeHandlers)
}

export function shallowReative(target) {
    return createReativeObject(target, false, shallowReativeHandlers)
}

export function readonly(target) {
    return createReativeObject(target, true, readonlyHandlers)
}

export function shallowReadonly(target) {
    return createReativeObject(target, true, shallowReadonlyHandlers)
}
//这个四个方法 总结一下：是不是只读，是不是深度，
//方法一：定义四各种的方法   方法二通过参数来实现  柯里化：通过参数来处理我们不同的逻辑
// 这四个方法最核心的式  new  Proxy()   对数据的读取和数据的修改 ， get  set
const reativeMap = new WeakMap(); //自动的垃圾回收，不会造成内存泄漏，就是key 只能是对象
const readonlyMap = new WeakMap();
export function createReativeObject(target, isReadonly, baseHandlers) {
    //最重要的逻辑 ：创建  new Proxy
    //注意： reativeApi 都是通过  proxy 进行拦截  target 一定是对象 
    //ref  简单的数据类型
    //（1）判断类型 是不是对象  在shared 添加这个方法
    if (!isObject(target)) {
        return target
    }
    //(2) 如果某个对象已经代理了 就不用再代理 ， 这个对象 被代理的是深度， 或的只读代理
    //方法 创建一个映射表  
    const proxyMap = isReadonly ? readonlyMap : reativeMap
     //判断缓存中是否有这个对象
     const exisitProxy =proxyMap.get(target)
     if(exisitProxy){
         return exisitProxy // 如果已经代理直接返回
     }
    //核心
    const proxy = new Proxy(target, baseHandlers)
    proxyMap.set(target, proxy);// 将要代理的对象和对应代理的结果缓存起来
    return proxy
}