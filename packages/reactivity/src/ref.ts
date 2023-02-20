import { Track, trigger } from "./effect";
import { TrackOptypes, TriggerOpTypes, haseChange } from "./optionations";
import { isObject,isArray } from '@vue/shared';
import {reative} from './index'

export const ref = (target) => createRef(target)
export const shallowRef = (target) => createRef(target, true)

const convert =(val)=>isObject(val)?reative(val):val
//创建ref类
class RefImpl {
    //属性
    public __v_isRef = true; //标识 他是 ref
    public _value; // 声明
    constructor(public rawValue, public shallow) {
        //ts
        //  this.target = target
        this._value = shallow? rawValue:convert(rawValue); //用户传入的值  原来的值
    }

    //类的属性访问器   问题实现响应式   收集依赖Track  触 发更新  trigger
    get value() {
        //获取  name.value
        Track(this, TrackOptypes.GET, "value"); //收集依赖
        return this._value;
    }

    set value(newValue) {
        if (!haseChange(newValue, this._value)) {
            this._value = newValue; //新值给就zh
            this.rawValue = this.shallow?newValue :convert(newValue)
            trigger(this, TriggerOpTypes.SET, "value", newValue);
        }
    }
}

const createRef = (rawValue, shallow = false) => new RefImpl(rawValue, shallow)

//实现toRef
export const toRef = (target,key) => new ObjectRefImpl(target,key)

class  ObjectRefImpl{ //ts 
      public __v_isRef = true
    constructor(public target,public key){

    }
    //获取   myAge.value
    get value(){
         return this.target[this.key] //获取到值
    }
    set value(newValue){
        this.target[this.key] = newValue
    }
}

//实现toRefs
export const toRefs = (target) => {
   //遍历
   let ret = isArray(target)?new Array(target.length):{}
   for( let key in target){
    ret[key] =  toRef(target,key)
   }
    return ret
}