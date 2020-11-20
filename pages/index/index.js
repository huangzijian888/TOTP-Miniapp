const TOTP = require('../../utils/totp')
let util = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        current_index: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const second = util.getSeconds() % 30;
        this.setData({
            current_index: Math.floor(second / 5)
        })
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
    updateCode: function () {
        const tokens = [
            {
                logo_url: '../../static/logo/github.png',
                issuer: 'Github',
                account: 'huangzijian888',
                secret: 'test'
            },
            {
                logo_url: '../../static/logo/google.png',
                issuer: 'Google',
                account: 'huangzijian888@gmail.com',
                secret: 'huangzijian'
            }
        ]
        for (let i = 0; i < tokens.length; i++) {
            let code = TOTP.now(tokens[i].secret);
            tokens[i].code = code
        }
        this.setData({
            tokens
        })
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
