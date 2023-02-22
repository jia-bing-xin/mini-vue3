import { hasOwn } from "@vue/shared/src";

export const componentPublicIntance = {
    // {_:instance}
    get({ _: instance }, key) {
        //获取值 props children  data
        const { props, data, setupState } = instance
        if (key[0] == "$") { // 属性 $ 开头的不能获取
            return
        }
        if (hasOwn(props, key)) {
            return props[key]
        } else if (hasOwn(setupState, key)) {
            return setupState[key]
        }
    },
    set({ _: instance }, key, value) {
        const { props, data, setupState } = instance

        if (hasOwn(props, key)) {
            props[key] = value
        } else if (hasOwn(setupState, key)) {
            setupState[key] = value
        }
    }
}