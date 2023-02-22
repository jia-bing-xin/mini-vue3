import { isObject } from "@vue/shared";

//四个api 各子的处理方法
import {
    reativeHandlers,
    shallowReativeHandlers,
    readonlyHandlers,
    shallowReadonlyHandlers
} from './baseHandlers'

export const reative = (target) => createReativeObject(target, false, reativeHandlers)
export const shallowReative = (target) => createReativeObject(target, false, shallowReativeHandlers)
export const readonly = (target) => createReativeObject(target, true, readonlyHandlers)
export const shallowReadonly = (target) => createReativeObject(target, true, shallowReadonlyHandlers)

//创建weekmap,防止对已代理的值，进行再次代理
const reativeMap = new WeakMap();
const readonlyMap = new WeakMap();
/**
 * @param {*} target ---响应式传入的值
 * @param {boolean} isReadonly ---是否是只读的
 * @param {*} baseHandlers ---Proxy的handlers用来配置get和set
 */
const createReativeObject = (target, isReadonly: boolean, baseHandlers) => {
    //（1）判断类型 是不是ref  简单的数据类型
    if (!isObject(target)) {
        return target
    }
    //(2) 如果某个对象已经代理了 就不用再代理 ， 这个对象 被代理的是深度， 或的只读代理
    //方法 创建一个映射表
    const proxyMap = isReadonly ? readonlyMap : reativeMap
    const exisitProxy = proxyMap.get(target)
    if (exisitProxy) {
        return exisitProxy
    }
    //最重要的逻辑 ：创建  new Proxy
    const proxy = new Proxy(target, baseHandlers)
    proxyMap.set(target, proxy);
    return proxy
}