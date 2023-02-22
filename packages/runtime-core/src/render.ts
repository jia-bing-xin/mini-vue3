import { apiCreateApp } from './apiCreateApp'
export function createRender(renderOptionDom) { //实现渲染  vue3 => vnode =>render
    // 返回 对象
    let render = (vnode, container) => { //渲染 
        //组件初始化 
        console.log(vnode)
    }
    return {
        createApp: apiCreateApp(render) // 1创建 vnode  在框架种 组件操作 =vnode=》render()
    }
}

