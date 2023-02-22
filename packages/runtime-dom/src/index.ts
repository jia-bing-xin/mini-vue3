import { extend } from '@vue/shared'
import { nodeOps } from './nodeOps'
import { patchProps } from './patchProp'
import { createRender } from '@vue/runtime-core'

export const renderOptionDom = extend({ patchProps }, nodeOps)

//createApp
export const createApp = (rootComponent, rootProps) => {
    // 有不同的平台  创建 createRender  渲染器
    let app = createRender(renderOptionDom).createApp(rootComponent, rootProps) //高阶函数  { mount:}
    let { mount } = app
    app.mount = function (container) { //"#app"
        //挂载组件
        //先清空 自己的内容
        container = nodeOps.querySelector(container);
        container.innerHTML = ''
        //将组件渲染的dom元素进行挂载
        mount(container)
    }
    return app
}