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
        if (!tokens) {
            tokens = []
        }
        tokens.push(token);
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
            title: '添加成功',
            icon: 'success',
            duration: 2000
        });
    },
    /**
     * 更新本地缓存及应用 tokens
     * @param tokens
     */
    updateTokenStorage: function (tokens) {
        if (!tokens) {
            return 'error';
        }
        wx.setStorage({
            key: 'tokens',
            data: tokens,
            fail: () => {
                return 'error';
            }
        });
        this.setData({
            tokens
        })
        return 'success';
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
