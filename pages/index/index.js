"use strict";
exports.__esModule = true;
var app = getApp();
var scenceStyleList = [
    {
        background: '#e0e7f9',
        style: 'width:6vh; height:5vh',
        icon: '/resources/index/home_icon_gohome.png',
        textColor: '#497df8'
    },
    {
        background: '#f9f0d3',
        style: 'width:10vw; height:8vw',
        icon: '/resources/index/home_icon_sleep.png',
        textColor: '#c3a415'
    },
    {
        background: '#d2f7f3',
        style: 'width:6vh; heigth:5vh',
        icon: '/resources/index/home_icon_read.png',
        textColor: '#23b09e'
    },
    {
        background: '#fbd9da',
        style: 'width:8vw; height:8vw',
        icon: '/resources/index/home_icon_happy.png',
        textColor: '#e04950'
    }
];
Page({
    data: {
        haveRoom: false,
        roomId: app.familyList ? '你的套间号：' + app.familyList[app.user.FamilyIndex].name : '下拉获取房间',
        roomList: app.familyList
    },
    onLoad: function () {
    },
    roomButtonClick: function (event) {
        if (app.user.RegisterState) {
            var url = event.currentTarget.dataset.url;
            wx.navigateTo({
                url: url
            });
        }
        else {
            wx.showToast({
                title: '注册对话框',
                icon: 'none',
                duration: 1500
            });
        }
    },
    getRoom: function () {
        var _this = this;
        var message;
        var keyMap = app.createSecretKey(app.hotelID);
        var data = {
            HOTELID: app.hotelID,
            OPENID: app.user.OpenID,
            TIMESTAMP: keyMap.timeStamp,
            FKEY: keyMap.timeStamp
        };
        app.postRequest('appHotel/getHotelOrderByOpenId', true, data, function (res) {
            wx.stopPullDownRefresh({});
            if (res.data.code == 101) {
                var familyName = app.updateFamilies(res.data);
                if (familyName && _this.setData) {
                    _this.setData({
                        haveRoom: true,
                        roomId: '你的套间号：' + familyName,
                        roomList: app.familyList
                    });
                }
            }
            else {
                message = '你还没入住，请到前台办理入住手续';
                if (_this.setData && message) {
                    _this.setData({
                        haveRoom: false,
                        roomId: '下拉获取房间',
                        roomList: []
                    });
                    wx.showToast({
                        title: message,
                        icon: 'none',
                        duration: 1500
                    });
                }
            }
        });
    },
    getScenceMode: function () {
        var _this = this;
        if (app.familyList) {
            var userID = app.user.UserID;
            var keyMap = app.createSecretKey(userID);
            var data = {
                USERID: userID,
                FAMILYID: app.familyList[app.user.FamilyIndex].ID,
                TIMESTAMP: keyMap.timeStamp,
                FKEY: keyMap.key
            };
            app.postRequest('appFamily/getSceneMode.do', false, data, function (res) {
                if (res.data.code == 101 && _this.setData) {
                    var scenceList = res.data.data;
                    for (var i = 0; i < scenceList.length; i++) {
                        var index = i % scenceList.length;
                        scenceList[i].STYLE = scenceStyleList[index];
                    }
                    _this.setData({
                        scenceList: scenceList
                    });
                }
                else {
                    wx.showToast({
                        title: res.data.msg
                    });
                }
            });
        }
        else {
        }
    },
    changeRoom: function (event) {
        if (event.detail.value && app.familyList) {
            app.user.FamilyIndex = event.detail.value;
            var familyName = app.familyList[app.user.FamilyIndex].name;
            this.setData({
                roomId: '你的套间号：' + familyName
            });
        }
    },
    onPullDownRefresh: function () {
        this.getRoom();
    },
    bookRoomClick: function () {
        wx.navigateTo({
            url: '/pages/book/book'
        });
        if (app.user.RegisterState) {
            wx.navigateTo({
                url: '/pages/book/book'
            });
        }
        else {
            console.log('去注册');
        }
    }
});
