//事件
//div  @cilck='fn'   div @cilck="fn1" 
//一个元素的 绑定事件   addEventListener
//缓存 {click:fn1}  =>


export const patchEvent = (el, key, value) => {
    // 1对函数缓存
    const invokers = el._vei || (el._vei = {});
    const exists = invokers[key] //
    if (exists && value) {
        exists.value = value 
    } else {
        //获取事件名称  (1)新的有  （2）新的没有
        const eventName = key.slice(2).toLowerCase()
        if (value) { //新的有
            let invoker = invokers[eventName] = createInvoker(value)
            el.addEventListener(eventName, invoker)//添加事件
        } else {//没有   以前删除
            el.removeEventLister(eventName, exists)
            invokers[eventName] = undefined //清楚缓存
        }
    }
}


function createInvoker(value) {
    const invoker = (e) => {
        invoker.value(e)
    }
    invoker.value = value
    return invoker
}

//  事件的处理

//1 给元素缓存一个绑定的事件列表
//2如果缓存中没有 ，并且value 有值 需要绑定方法并缓存掐了
//3以前绑定过 需要删除，缓存也缓存
//4 两个都有  直接改变invoker中的value 指向最新的事件