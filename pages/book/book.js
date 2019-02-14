"use strict";
exports.__esModule = true;
var util_1 = require("../../utils/util");
var app = getApp();
Page({
    data: {
        startDate: util_1.formatTime(new Date()),
        enterDate: util_1.formatTime(new Date()),
        leaveDate: util_1.formatTime(new Date()),
        year: new Date().getFullYear() + 1,
        list: [],
        personCount: 1,
        days: 1,
        calendarOpen: false,
        dateTarget: 'enter',
        date: util_1.formatTime(new Date()).fullDate.replace(/-/g, '/')
    },
    onLoad: function () {
        var _this = this;
        var hotelID = app.hotelID;
        var keyMap = app.createSecretKey(hotelID);
        var data = {
            HOTELID: hotelID,
            FKEY: keyMap.key,
            TIMESTAMP: keyMap.timeStamp
        };
        app.postRequest('appHotel/getHotelType.do', true, data, function (res) {
            if (res.data.code == 101) {
                var typeList = res.data.data;
                for (var i = 0; i < typeList.length; i++) {
                    if (typeList[i].INFO && typeList[i].INFO.length > 30) {
                        typeList[i].INFO = typeList[i].INFO.subString(0, 30) + '...';
                    }
                }
                _this.setData({
                    list: typeList
                });
            }
            else {
                wx.showToast({
                    title: '订房请求失败',
                    icon: 'none'
                });
            }
        });
    },
    onReady: function () {
        var leaveDate = new Date();
        leaveDate.setDate(leaveDate.getDate() + 1);
        this.setData({
            leaveDate: util_1.formatTime(leaveDate)
        });
    },
    enterDateChange: function (event) {
        var date = new Date(event.detail.value.replace(/-/g, '/'));
        this.setData({
            enterDate: util_1.formatTime(date),
            leaveDate: util_1.formatTime(date),
            startDate: util_1.formatTime(date)
        });
    },
    leaveDateChange: function (event) {
        var enterDate = new Date(this.data.enterDate.fullDate.replace(/-/g, '/'));
        var date = new Date(event.detail.value.replace(/-/g, '/') + " 23:59:59");
        var days = (date.getTime() - enterDate.getTime()) / (24 * 60 * 60 * 1000);
        days = parseInt(days.toString());
        this.setData({
            leaveDate: util_1.formatTime(date),
            days: days
        });
    }
});
