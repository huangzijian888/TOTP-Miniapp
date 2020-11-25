Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: '',
        issuer: '',
        account: '',
        token: {},
        tokens: [],
        issuerInput: false,
        accountInput: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let index = options.index;
        let tokens = wx.getStorageSync('tokens');
        let token = tokens[index];
        this.setData({
            index, token, tokens,
            issuer: token.issuer,
            account: token.account
        })
    },
    /**
     * 输入框获得焦点 handle
     * @param event
     */
    focusHandle: function (event) {
        const element = event.currentTarget.dataset.element
        if (element === 'issuer') {
            this.setData({
                issuerInput: true
            })
        }
        if (element === 'account') {
            this.setData({
                accountInput: true
            })
        }

    },
    /**
     * 输出框失去焦点 handle
     * @param event
     */
    blurHandle: function (event) {
        const element = event.currentTarget.dataset.element
        if (element === 'issuer') {
            this.setData({
                issuerInput: false
            })
        }
        if (element === 'account') {
            this.setData({
                accountInput: false
            })
        }
    },
    /**
     * 选择图片
     */
    chooseImage: function () {
        wx.chooseImage({
            count: 1,
            sourceType: ['album'],
            sizeType: ['original'],
            success: (res) => {
                let filePath = res.tempFilePaths[0]
                let isPng = this.isPng(filePath);
                if (isPng) {
                    let token = this.data.token;
                    token.logo_url = filePath;
                    this.setData({
                        token
                    })
                }
            }
        })
    },

    /**
     * 检查图片是否是 png 格式
     * @param path 图片的路径
     * @returns {boolean} 是 true 否 false
     */
    isPng: function (path) {
        const reg = /.+.png$/
        let result = path.match(reg);
        if (!result) {
            wx.showModal({
                title: '错误',
                content: '请选择透明背景的图片',
                showCancel: false,
            })
            return false;
        }
        return true;
    },
    /**
     * 保存更新
     */
    save: function () {
        let index = this.data.index
        let tokens = this.data.tokens
        let token = this.data.token;
        token.issuer = this.data.issuer;
        token.account = this.data.account;
        tokens[index] = token;
        let result = this.updateTokenStorage(tokens);
        if (result) {
            wx.showToast({
                title: '保存成功',
                duration: 800
            })
            setTimeout(() => {
                wx.redirectTo({
                    url: '/pages/index/index'
                })
            }, 1000)
        }
    },
    cancel: function () {
        wx.navigateBack()
    },
    /**
     * 更新本地缓存
     * @param tokens
     * @returns {boolean}
     */
    updateTokenStorage: function (tokens) {
        if (!tokens) {
            return false;
        }
        wx.setStorage({
            key: 'tokens',
            data: tokens,
            fail: () => {
                return false;
            }
        });
        return true;
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
