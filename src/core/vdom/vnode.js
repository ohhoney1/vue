/* @flow */

export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag // *cnjs*: 当前节点的标签名
    this.data = data // *cnjs*: 当前节点对应的对象，包含了一些具体的数据信息
    this.children = children // *cnjs*: 当前节点的子节点
    this.text = text // *cnjs*: 当前节点的文本
    this.elm = elm // *cnjs*: 当前虚拟节点对应的真是dom节点
    this.ns = undefined // *cnjs*: 当前节点的命名空间
    this.context = context // *cnjs*: 编译作用域
    this.fnContext = undefined // *cnjs*: 函数式组件的真正作用域
    this.fnOptions = undefined // *cnjs*: 函数式组件的 options 选项，为了 SSR 的缓存而用
    this.fnScopeId = undefined // *cnjs*: 函数式组件的 scope id
    this.key = data && data.key // *cnjs*: 节点的 key 属性，被当做节点的标志，用以优化
    this.componentOptions = componentOptions // *cnjs*: 组件的 options 选项
    this.componentInstance = undefined // *cnjs*: 当前节点对应的组件的实例
    this.parent = undefined // *cnjs*: 当前节点的父节点
    this.raw = false // *cnjs*: 原生html节点
    this.isStatic = false // *cnjs*: 静态节点
    this.isRootInsert = true // *cnjs*: 作为根节点插入
    this.isComment = false // *cnjs*: 注释节点
    this.isCloned = false // *cnjs*: 克隆节点
    this.isOnce = false // *cnjs*: v-once 指令
    this.asyncFactory = asyncFactory // *cnjs*: 异步组件的工厂函数
    this.asyncMeta = undefined // *cnjs*: TODO:
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}

export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
