import { isArray, isIntegerKey } from "@vue/shared"
import { TriggerOpTypes } from './optionations'

export const effect = (fn, options: any = {}) => {
    //创建响应式effect，数据变化时重新执行
    const effect = createReactiveEffect(fn, options)
    //(1)响应式的effect默认会先执行一次
    if (!options.lazy) {
        effect()
    }
    return effect;
}

let uid = 0
let activeEffect //存放当前的effect
const effectStack = [] //创建一个栈
function createReactiveEffect(fn, options) {
    //注意：这个方法返回的是一个函数
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) { //保证effect没有加入到effectStack
            try {  //语句用于处理代码中可能出现的错误信息。
                //入栈
                effectStack.push(effect)
                activeEffect = effect
                return fn(); // 函数执行时会取值操作 会执行get 方法的
            } finally {
                //出栈 
                effectStack.pop()
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    }
    effect.id = uid++; //添加标识，用于区分effect(是谁的)
    effect._isEffect = true;// 这个标识用于区分他是响应式effect
    effect.raw = fn; //保存用户的原函数
    effect.options = options; //再effect上保存用户的选项
    return effect
}

// 对象中的属性 收集当前他对应的effect函数
let targetMap = new WeakMap()
//定义track 作用收集effect
export const Track = (target, type, key) => { //可以拿到当前的effect
    activeEffect //当前正在运行的effect
    // 问题:  weakMmap =>key=  target=> 属性 =》[effect,effect]
    if (activeEffect === undefined) { // 此属性不用收集依赖，因为没有再effect中使用
        return;
    }
    // (1)获取 effect
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map)) //第二个参数是不是他的只  map
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
    }
}

//触发更新
// 1 处理对象
export function trigger(target, type, key?, newValue?, oldValue?) {
    // 触发依赖  问题
    console.log(targetMap) //收集依赖  map  =>{target:map{key=>set}}
    const depsMap = targetMap.get(target) // map
    if (!depsMap) {
        return
    }
    //有
    // let effects = depsMap.get(key) // set []
    let effectSet = new Set() //如果有多个同时修改一个值，并且相同 ，set 过滤一下
    const add = (effectAdd) => {
        if (effectAdd) {
            effectAdd.forEach(effect => effectSet.add(effect))
        }
    }
    //处理数组 就是 key === length   修改 数组的 length
    if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            //  console.log(depsMap,555)
            console.log(key, newValue)
            console.log(dep) // [1,2,3]   length =1
            // 如果更改 的长度 小于 收集的索引 ，那么这个索引需要重新执行 effect
            if (key === 'length' || key > newValue) {
                add(dep)
            }
        })
    } else {
        //可能是对象
        if (key != undefined) {
            add(depsMap.get(key)) //获取当前属性的effect
        }
        //数组  修改  索引
        switch (type) {
            case TriggerOpTypes.ADD:
                if (isArray(target) && isIntegerKey(key)) {
                    add(depsMap.get('length'))
                }
        }
    }
    //执行
    effectSet.forEach((effect: any) => {
        if (effect.options.sch) {
            effect.options.sch(effect)  //_drity = true
        } else {
            effect()
        }
    })

}