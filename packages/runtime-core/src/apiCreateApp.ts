//创建vnode
import { createVnode } from './vnode'
export function apiCreateApp(render) {
    return function createApp(rootComponent, rootProps) { //告诉他是那个组件，那个属性
        let app = {
            //添加相关的属性
            _component: rootComponent,
            _props: rootProps,
            _container: null,
            mount(container) { //挂载的位置
                //1vnode： 根据组件创建vnode节点
                let vnode = createVnode(rootComponent, rootProps)
                //2 渲染 render(vnode,container) 
                render(vnode, container)
                app._container = container
            }
        }
        return app
    }
}