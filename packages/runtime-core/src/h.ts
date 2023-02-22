import { isObject } from "@vue/shared";
import { isVnode, createVnode } from './vnode'
export function h(type, propsOrchildren, children) { //变成 vnode
    //参数
    const i = arguments.length //获取到参数的个数

    if (i == 2) {
        //这个 元素  + 属性   元素 + chldren
        if (isObject(propsOrchildren)) { //h('div',{})
            if (isVnode(propsOrchildren)) { //h('div',h('div'))  特殊
                return createVnode(type, null, [propsOrchildren])
            }
            // props without children
            return createVnode(type, propsOrchildren)//没有儿子
        } else {
            //就是儿子
            return createVnode(type, null, propsOrchildren)
        }

    } else {
        // h('div',{},'1','2','3')
        if (i > 3) {
            children = Array.prototype.slice.call(arguments, 2)
        } else if (i === 3 && isVnode(children)) { //h('div',{}，h('div')) 
            children = [children]
        }
        return createVnode(type, propsOrchildren, children)
    }

}

//Vue3  h() =>vnode    就是  render  返回值  h('div')

// 将这元素渲染到页面  =》 dom  
  
