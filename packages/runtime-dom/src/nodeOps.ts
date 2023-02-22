//操作节点  增  删 改 查  元素  和文本

export const nodeOps = {
    createElement: tagName => document.createElement(tagName),
    remove: child => {
        let parent = child.parentNode;
        if (parent) {
            parent.removeChild(child)
        }
    },
    insert: (child, parent, ancher = null) => {
        parent.insertBefore(child, ancher)
    },
    querySelector: slect => document.querySelector(slect),
    setElementText: (el, text) => el.textConent = text,
    createText: text => document.createTextNode(text),
    setText: (node, text) => node.nodeValue = text

}