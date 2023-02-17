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
    let depsMap = targetMap.get(target); //没有  
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map)) //第二个参数是不是他的只  map
    }
    let dep = depsMap.get(key)
     if(!dep ){ //没有key
         depsMap.set(key,(dep = new Set))
     }
     //设置  set
     if(!dep.has(activeEffect)){
           dep.add(activeEffect)
     }

}