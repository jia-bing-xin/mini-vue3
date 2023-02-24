import { ShapeFlags, isFuction, isObject } from "@vue/shared/src";
import { componentPublicIntance } from './componentPublicIntance'

//组件 实例
export const createComponentInstance = (vnode) => {
    //就是一个对象
    const instance = { //组件 props attrs slots
        vnode,
        type: vnode.type,//组件的类型
        props: {},//组件的属性
        attrs: {},//attrs props   my-div a="1"  b="2"   props:{ "a"}  attrs
        setupState: {}, //setup返回值
        ctx: {},//代理   instance.props.name  proxy.name
        proxy: {},
        data: { a: 1 },
        render: false,
        isMounted: false// 是否挂载
    }
    instance.ctx = { _: instance }
    return instance
}

//2解析数据到组件实例上
export const setupComponent = (instance) => {
    //设置值
    const { props, children } = instance.vnode
    // 根据这props 解析到组件实例上
    instance.props = props//initProps
    instance.children = children // slots 插槽
    let shapeFlag = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
    if (shapeFlag) { //有状态的组件
        setUpStateComponent(instance)
    }
}
//处理setup
function setUpStateComponent(instance) {
    //代理
    instance.proxy = new Proxy(instance.ctx, componentPublicIntance as any)
    //1获取组件的类型拿到组件setup方法   参数（props,coentxt）  返回值 (对象，函数)
    let Component = instance.type
    let { setup } = Component
    //看一下这个组件有没有 setup  render
    if (setup) {
        //处理参数
        let setupContext = crateConentext(instance) //对象
        let setupResult = setup(instance.props, setupContext)
        // 问题 setup 返回值  1 对象  2 函数
        handlerSetupResult(instance, setupResult) // 如果是对象 就是值   如果是函数 就是render

    } else { //没有setup
        //调用render 
        finishComponentSetup(instance) //vnode.type
    }
    //    setup()

    //render
    Component.render(instance.proxy) // 处理render 
}
//处理setup的返回结果
function handlerSetupResult(instance, setupResult) {
    // 1 对象  2 函数
    if (isFuction(setupResult)) { //render
        instance.render = setupResult //setup 返回的函数保存 到实例 
    } else if (isObject(setupResult)) {
        instance.setupState = setupResult
    }
    //做render
    finishComponentSetup(instance)

}
//处理render
function finishComponentSetup(instance) {
    //判断一下 组件中有没有这个render
    let Component = instance.type
    if (!instance.render) { //没有

        if (!Component.render && Component.template) {
            //模板=>render
        }
        instance.render = Component.render
    }
    console.log(instance.render.toString())
}
//context
function crateConentext(instance) {
    return {
        attrs: instance.attrs,
        slots: instance.slots,
        emit: () => { },
        expose: () => { }
    }
}