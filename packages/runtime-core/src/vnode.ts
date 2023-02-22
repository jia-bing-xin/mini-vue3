//创建 Vnode   1:createVnode  和h() 作用一样
// 2区分是组件还是元素
// 3 创建vnode
//注意： createVnode =  h('div',{style；{color:red}},[])
import { isString, ShapeFlags, isObject, isArray } from '@vue/shared'

export const createVnode = (type, props, children = null) => {
   //区分 是组件 还是 元素
   //vnode  {}
   let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? //标识  位运算
      ShapeFlags.STATEFUL_COMPONENT : 0
   const vnode = {
      _v_isVnode: true, //是一个vnode节点
      type,
      props,
      children,
      key: props && props.key,//diff 会用到
      el: null, //和真实的元素和vnode 对应
      component: {},
      shapeFlag
   }
   //儿子标识 h('div',{style；{color:red}},[])
   normalizeChildren(vnode, children)
   return vnode
}

function normalizeChildren(vnode, children) {
   //进行判断
   let type = 0
   if (children == null) {

   } else if (isArray(children)) { // 数组
      type = ShapeFlags.ARRAY_CHILDREN
   } else { //文本
      type = ShapeFlags.TEXT_CHILDREN
   }
   vnode.shapeFlag = vnode.shapeFlag | type
}

//判断他是不是一个vnode
export function isVnode(vnode) {
   return vnode._v_isVnode
}

//元素的children  变成 vnode
export const TEXT = Symbol('text')
export function CVnode(child) {
   // [ 'text']  [h()]
   if (isObject(child)) return child
   return createVnode(TEXT, null, String(child))
}