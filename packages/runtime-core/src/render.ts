import { apiCreateApp } from './apiCreateApp'
import { ShapeFlags } from '@vue/shared/src';
import { effect } from "@vue/reactivity"
import { CVnode, TEXT } from './vnode'
import { createComponentInstance, setupComponent } from './component'

export function createRender(renderOptionDom) { //实现渲染  vue3 => vnode =>render
    //获取全部的dom 操作
    const {
        insert: hostInsert,
        remove: hostRemove,
        patchProps: hostPatchProp,
        createElement: hostCreateElement, //创建元素
        createText: hostCreateText, // 创建文本
        createComment: hostCreateComment,
        setText: hostSetText,
        setElementText: hostSetElementText,
    } = renderOptionDom

    function setupRenderEffect(instance, container) { //effect
        //创建 effect  
        effect(function componentEffect() {
            //需要创建一个effect 在effect中调用render  ,这样render  方法中获取数据会收集这个effect
            //属性改变重新执行
            //判断 第一加载
            if (!instance.isMounted) {
                //获取到render 返回值
                let proxy = instance.proxy //组件的实例
                //  console.log(proxy)
                let subTree = instance.render.call(proxy, proxy)  //执行 render  组件中  创建 渲染 节点  h（）
                // console.log(subTree) //组件渲染的节点  =》渲染到页面中
                //渲染子树  创建元素
                patch(null, subTree, container)

            }
        })
    }
    //------------------------------处理组件---------------
    const mountComponent = (InitialVnode, container) => {
        //组件的渲染流程  
        // 1.先有一个组件的实例对象  render (proxy)
        const instance = InitialVnode.component = createComponentInstance(InitialVnode)
        //2.解析数据到这个实现对象中
        setupComponent(instance)
        //3 创建一个effect 让 render函数执行
        setupRenderEffect(instance, container)
    }
    // 组件的创建
    const processComponent = (prevNode, curNode, container) => {
        if (prevNode == null) {//你是第一次加载
            mountComponent(curNode, container)
        } else { //更新

        }
    }
    const patch = (prevNode, curNode, container) => {
        //针对不同的类型  1 组件   2 元素
        let { shapeFlag, type } = curNode
        switch (type) {
            case TEXT:
                //处理文本
                processText(prevNode, curNode, container)
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) { //div
                    //处理元素 =》加载组件 一样
                    processElement(prevNode, curNode, container)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    //组件
                    processComponent(prevNode, curNode, container)
                }
        }
    }
    //------------------------处理文本------------
    function processText(prevNode, curNode, container) {
        if (prevNode == null) {
            //  创建文本  渲染到页面 =
            hostInsert(curNode.el = hostCreateText(curNode.children), container)
        }
    }
    //---------------------处理元素-----------
    function mountChildren(el, children) {
        //循环
        for (let i = 0; i < children.length; i++) {
            // 1[ '张三']   2 [h('div')]
            let child = CVnode(children[i])
            //创建 文本  创建元素  
            patch(null, child, el)
        }
    }
    //加载元素
    function mountElement(vnode, container) {
        //递归 渲染  h('div',{},[h('div')]) =》dom操作  =》放到对相应页面
        //vnode h()
        const { props, shapeFlag, type, children } = vnode
        //创建的元素
        let el = hostCreateElement(type)
        //添加属性
        if (props) {
            for (let key in props) {
                hostPatchProp(el, key, null, props[key])
            }

        }
        //处理children 
        // h('div',{style:{color:'red'}},'text')
        // h('div',{style:{color:'red'}},['text'])
        // h('div',{style:{color:'red'}},[h()])
        if (children) {
            if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
                //创建为文本元素
                hostSetElementText(el, children)
            } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                //递归 patch 
                mountChildren(el, children)
            }
        }
        //放到对应的位置
        hostInsert(el, container)

    }
    function processElement(prevNode, curNode, container) {
        if (prevNode == null) {
            mountElement(curNode, container)
        } else {//更新

        }
    }
    // 返回 对象
    let render = (vnode, container) => { //渲染 
        //组件初始化
        patch(null, vnode, container)
    }
    return {
        createApp: apiCreateApp(render) // 1创建 vnode  在框架种 组件操作 =vnode=》render()
    }
}

// 给组件 创建一个instance  添加相关信息
//  处理setup  中context  有四参数
// proxy 为方便取值


// render  (1) setup 返回值是一个函数就是render   (2) component render
// 如果  setup 的返回值 是一个函数就执行这render  源码中有一个判断

//Vue3组件初始化流程  ： 将组件变成  vnode  =》创建一个组件实例 =》在进行渲染（vnode=>dom）