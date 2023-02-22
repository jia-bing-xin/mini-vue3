import { isFuction } from "@vue/shared";
import { effect } from './effect'
export const computed = (getterOrOptons) => {
    //注意  (1) 函数   （2） 对象
    //1 处理数据
    let getter; //获取
    let setter;//设置数据
    if (isFuction(getterOrOptons)) { //函数  getter
        getter = getterOrOptons,
            setter = () => {
                console.warn('computed value must be readonly')
            }
    } else { //对象 { get(),set{}}
        getter = getterOrOptons.get;
        setter = getterOrOptons.set
    }
    //返回值
    return new ComputedRefImpl(getter, setter)
}


class ComputedRefImpl {
    //定义属性
    public _dirty = true; //默认获取执行
    public _value;
    public effect
    constructor(getter, public setter) {
        //这个effect   默认不执行    age.value  effect 收集
        this.effect = effect(getter, {
            lazy: true,
            sch: () => {  //修改数据的时候执行   age.value  = 20  trigger
                if (!this._dirty) {
                    this._dirty = true
                }
            }
        })
    }

    //获取  myAge.value  =>getter 方法中的值
    get value() {
        //获取执行
        if (this._dirty) {
            this._value = this.effect() //获取用户的值
            this._dirty = false
        }
        return this._value
    }
    set value(newValue) {
        this.setter(newValue)
    }
}





// let myAge =  computed(()=>{  // 1 computed 定义了，没有使用 不会触发里面的方法
//     console.log('缓存机制')  // _drity
//        return age.value + 20  收集effect
//  })