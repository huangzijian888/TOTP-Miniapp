const TOTP = require('../../utils/totp')
let util = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        current_index: 0,
        tokens: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const second = util.getSeconds() % 30;
        let tokens = wx.getStorageSync('tokens');
        if (!tokens) {
            tokens = [];
        }
        this.setData({
            current_index: Math.floor(second / 5),
            tokens: tokens
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const timer = setInterval(() => {
            let i = util.getSeconds() % 30;
            if (i % 5 === 0) {
                if (i === 0) {
                    this.updateCode();
                }
                this.setData({
                    current_index: Math.floor(i / 5)
                });
            }
        }, 1000)
        this.updateCode();
    },
    /**
     * 更新验证码
     */
    updateCode: function () {
        const tokens = this.data.tokens
        if (!tokens) {
            return;
        }
        for (let i = 0; i < tokens.length; i++) {
            tokens[i].code = TOTP.now(tokens[i].secret);
        }
        this.setData({
            tokens
        })
    },
    /**
     * 添加按钮回调函数
     */
    clickAdd: function () {
        const self = this
        wx.scanCode({
            scanType: ['qrCode'],
            success: res => {
                self.addToken(res.result)
            },
            fail: error => {
                console.log("失败了", error)
            }

        })

    },
    /**
     * 长按对 token 进行操作
     * @param event 长按事件
     */
    tokenOperation: function (event) {
        const self = this;
        const index = event.currentTarget.dataset.index
        wx.showActionSheet({
            itemList: ['删除', '编辑'],
            success: (res) => {
                if (res.tapIndex === 0) {
                    self.deleteToke(index)
                }
                if (res.tapIndex === 1) {
                    wx.navigateTo({
                        url: '/pages/edit/edit?index=' + index
                    })
                }
            }
        })
    },
    /**
     * 删除 token
     * @param index 索引
     */
    deleteToke: function (index) {
        let tokens = this.data.tokens;
        const self = this
        wx.showModal({
            title: '温馨提示',
            content: '确定要删除吗？',
            success: (res) => {
                if (res.confirm) {
                    tokens.splice(index, 1)
                    const result = self.updateTokenStorage(tokens);
                    if (result) {
                        wx.showToast({
                            title: '删除成功',
                        })
                    } else {
                        wx.showToast({
                            title: '删除失败',
                            icon: 'none'
                        })
                    }
                }
            }
        })
    },
    /**
     * 长按验证码区域复制验证码
     * @param event 验证码区域长按事件
     */
    copyCode: function (event) {
        const index = event.currentTarget.dataset.index
        const code = this.data.tokens[index].code;
        wx.setClipboardData({
            data: code,
            success: () => {
                wx.showToast({
                    title: '验证码已复制',
                    icon: 'success'
                })
            }
        })
    },
    /**
     * 识别 url 获取相关参数写入 token
     * @param result_url
     */
    addToken: function (result_url) {
        const secret = util.getQueryByName(result_url, "secret");
        const issuer = util.getQueryByName(result_url, "issuer");
        const account = util.getAccount(result_url)
        if (!secret || !issuer || !account) {
            wx.showModal({
                title: '错误',
                content: '不是合法的 TOTP 码',
                showCancel: false,
            })
            return;
        } else if (null == TOTP.now(secret)) {
            wx.showModal({
                title: '错误',
                content: 'secret 不合法',
                showCancel: false,
            })
            return;
        }
        let token = {
            secret: secret,
            issuer: issuer,
            account: account,
            logo_url: '../../static/logo/github.png'
        }
        let tokens = wx.getStorageSync('tokens');
        let index = this.checkTokenIsExist(issuer, account, tokens);
        if (index !== -1) {
            tokens[index] = token;
        } else {
            if (!tokens) {
                tokens = []
            }
            tokens.push(token);
        }
        let result = this.updateTokenStorage(tokens);
        if (!result) {
            wx.showModal({
                title: '错误',
                content: '更新数据发生异常',
                showCancel: false,
            })
        }
        this.updateCode()
        wx.showToast({
            title: '密钥已保存',
            icon: 'success',
            duration: 2000
        });
    },
    /**
     * 检查在同一发布人下是否已经存在账户
     * @param issuer 发布人
     * @param account 账户
     * @param tokens token数组
     * @returns {number} 不存在返回 -1 存在返回索引
     */
    checkTokenIsExist: function (issuer, account, tokens) {
        if (!tokens) {
            return -1;
        }
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].issuer === issuer && tokens[i].account === account) {
                return i;
            }
        }
        return -1;
    },
    /**
     * 更新本地缓存和 data 里面的 tokens 值
     * @param tokens
     * @returns {boolean} 成功返回 true 失败返回 false
     */
    updateTokenStorage: function (tokens) {
        if (!tokens) {
            return false;
        }
        try {
            wx.setStorageSync("tokens", tokens);
        } catch (error) {
            return false;
        }
        this.setData({
            tokens
        })
        return true;
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
