// 获取当前时间秒
function getSeconds() {
    let now = new Date()
    return now.getSeconds()
}

function getQueryByName(url, name) {
    const reg = new RegExp('[?&]' + name + '=([^&#]+)');
    const query = url.match(reg);
    return query ? query[1] : null;
}

function getAccount(url, issuer) {
    const reg = new RegExp('\\S+' + issuer + ':(\\S+)\\?')
    const account = url.match(reg);
    return account ? account[1] : null
}

module.exports = {
    getSeconds: getSeconds,
    getQueryByName: getQueryByName,
    getAccount: getAccount
}
