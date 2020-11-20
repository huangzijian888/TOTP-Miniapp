// 获取当前时间秒
function getSeconds() {
    let now = new Date()
    return now.getSeconds()
}

module.exports = {
    getSeconds: getSeconds,
}
