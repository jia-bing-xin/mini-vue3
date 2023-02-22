export * from './shapeFlag'

export const isObject = (val) => typeof val == 'object' && val !== null;

export const extend = Object.assign

export const isArray = Array.isArray;

export const isFuction = (val) => typeof val === 'function';

export const isNumber = (val) => typeof val === 'number';

export const isString = (val) => typeof val === 'string';

//判断数组的 key 是不是整数
// [1,2]  "1":1
export const isIntegerKey = (key) => parseInt(key) + '' === key

// 对象中是否有这个属性
const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (target, key) => hasOwnProperty.call(target, key)

export const haseChange = (value, oldValie) => value !== oldValie