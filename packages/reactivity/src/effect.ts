export function effect(fn, options: any = {}) {
    //我们需要这个effect变成响应式的effct，可以做到数据变化重新执行
    const effect = createReactiveEffect(fn, options)
    //(1)响应式的effect默认会先执行一次
    if (!options.lazy) {
        effect()
    }

    return effect;
}
//创建响应式effect
//(1)添加属性   id  和 _iseffect用于区分他是响应式的effect   raw(用于保存用户的方法) ，options 再effect
//(2) 默认执行一次

let uid = 0
let activeEffect //存放当前的effect
//创建一个栈
const effectStack = []
function createReactiveEffect(fn, options) {
    //注意：这个方法返回的是一个函数
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) { //保证effect没有加入到effectStack
            try {  //语句用于处理代码中可能出现的错误信息。
                //入栈
                effectStack.push(effect)
                activeEffect = effect
                // console.log('todo.....')   //默认执行 用户的写的方法
                // 这个effect 是有返回结果的
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
//
//   effect(()=>{},{flush:'sync'})


//定义track 作用收集effect
//二 收集effect
// 上面的操作就是让对象中的属性  收集当前他对应的effect函数

// 创建表
let targetMap = new WeakMap()
export function Track(target, type, key) { //可以拿到当前的effect
    activeEffect //当前正在运行的effect
    // console.log(target, key,activeEffect) //获取当前的effect
    // 问题:  weakMmap =>key=  target=> 属性 =》[effect,effect]
    if (activeEffect === undefined) { // 此属性不用收集依赖，因为没有再effect中使用
        return;
    }
    // (1)获取 effect
    let depsMap = targetMap.get(target); //没有  
    if (!depsMap) { //没有 
        targetMap.set(target, (depsMap = new Map)) //第二个参数是不是他的只  map
    }
    //有 target 
    // 有没有key
    let dep = depsMap.get(key)
     if(!dep ){ //没有key
         depsMap.set(key,(dep = new Set))
     }
     //设置  set
     if(!dep.has(activeEffect)){ //没有
           dep.add(activeEffect)
     }
     console.log(targetMap)

}

//问题  因为的我们的函数调用时一个栈型结构 
/**
 * const state = reactive({name:'张三'，age:12,a:30})
   effect(()=>{ //effect 1  [effect1]
    state.name // 收集 effect1
      effect(()=>{//effect 2
          state.age = 20 // 收集effect2
      })
      state.a  // 收集的effect1
    })
 *
 * //解决方法  通过一个栈结构来处理  [effect1,]
 *  问题2： 不断的取值
 *  effect(()=>{
 *    state.name++ //数据更新
 *
 *   })
 *
 * 问题：3  就是我们的目标对象中有多个 effect   {name:"张三"，age:15} =》name=>[effect,effect]
 */