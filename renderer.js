function _q(el) {
    return document.querySelector(el)
}
const debugPanel = _q('#debug-panel')
const allContainer = _q('#all-container')
let isResize = false


document.addEventListener('mousedown', function (e) {
    let topAbove = debugPanel.offsetTop - 10
    let topBelow = debugPanel.offsetTop + 10
    if (e.pageY < topBelow && e.pageY > topAbove) {
        isResize = true
        document.body.style.cursor = 'ns-resize'
    }
})
document.addEventListener('mousemove', function (e) {
    let topAbove = debugPanel.offsetTop - 10
    let topBelow = debugPanel.offsetTop + 10
    if (e.pageY < topBelow && e.pageY > topAbove) {
        document.body.style.cursor = 'ns-resize'
    } else {
        document.body.style.cursor = 'auto'
    }
    if (isResize) {
        allContainer.style.gridTemplateRows = `auto 10px ${window.innerHeight - e.pageY}px`
    }
})
document.addEventListener('mouseup', function (e) {
    if (isResize) {
        isResize = false
        document.body.style.cursor = 'auto'
    }
})