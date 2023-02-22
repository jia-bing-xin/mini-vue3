import { extend } from '@vue/shared'
import { nodeOps } from './nodeOps'
import { patchProps } from './patchProp'

export const renderOptionDom = extend({ patchProps }, nodeOps)
