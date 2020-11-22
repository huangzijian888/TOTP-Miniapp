/**
 * 获取当前时间的秒值
 * @returns {number} 当前时间的秒值
 */
function getSeconds() {
    let now = new Date()
    return now.getSeconds()
}

/**
 * 获取参数
 * @param url totp 链接
 * @param name 参数名
 * @returns 参数值
 */
function getQueryByName(url, name) {
    const reg = new RegExp('[?&]' + name + '=([^&#]+)');
    const query = url.match(reg);
    return query ? query[1] : null;
}

/**
 * 获取账户信息
 * @param url totp 链接
 * @returns 账户信息
 */
function getAccount(url) {
    const reg = /([^\/^\:]+)(?=\?secret)/
    const account = url.match(reg);
    return account ? account[1] : null
}

module.exports = {
    getSeconds: getSeconds,
    getQueryByName: getQueryByName,
    getAccount: getAccount
}
