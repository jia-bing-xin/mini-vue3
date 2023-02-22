
//已经渲染到页面上 {style；{color:"red"}} =>  当前（新的）{style；{background:red,size:20px;}}

export const patchStyle = (el, prev, next) => {
    //style 处理
    const style = el.style

    //判断
    if (next == null) { //删除
        el.removeAttribute('style')
    } else {
        //注意
        //老的有 新的没有
        if (prev) {
            for (let key in prev) {
                if (next[key] == null) {
                    //清空
                    style[key] = ''
                }
            }
        }

        //新的赋值到 style  上
        for (let key in next) {
            style[key] = next[key]
        }
    }

}