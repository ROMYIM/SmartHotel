"use strict";
exports.__esModule = true;
var user_1 = require("./entities/user");
var family_1 = require("./entities/family");
var util_1 = require("./utils/util");
var ApplicationInstance = /** @class */ (function () {
    function ApplicationInstance() {
        this.appID = 'wxca20cf2091c1f4b9';
        this.secret = 'a3c50569004cd6bd101b727f2a002055';
        this.baseUrl = 'https://mkcloud.gotechcn.cn/smarthotel/';
        this.secretKey = 'p!P2QklnjGGaZKlw';
        this.user = new user_1.User();
        this.userInfoReadyCallback = undefined;
        this.recorderManager = wx.getRecorderManager();
    }
    ApplicationInstance.prototype.onLaunch = function () {
        var _this = this;
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: function (res) {
                            // 可以将 res 发送给后台解码出 unionId
                            _this.user.userInfo = res.userInfo;
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (_this.userInfoReadyCallback) {
                                _this.userInfoReadyCallback(res.userInfo);
                            }
                        }
                    });
                }
            }
        });
        var phone = wx.getStorageSync('phone');
        this.user.Phone = phone;
    };
    ApplicationInstance.prototype.createSecretKey = function (encryptCode) {
        var timeStamp = new Date().getTime();
        if (!encryptCode) {
            encryptCode = this.secret.toString();
        }
        var key = encryptCode.toString() + timeStamp + this.secretKey;
        return {
            key: util_1.md5(key),
            timeStamp: timeStamp
        };
    };
    ApplicationInstance.prototype.postRequest = function (url, needAuthorzation, params, successCallback) {
        if (needAuthorzation) {
            this.user.checkSession();
            if (!this.user.OpenID) {
                this.login();
                return;
            }
            if (!this.user.RegisterState) {
                wx.showToast({
                    title: '注册对话框',
                    icon: 'none'
                });
                return;
            }
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        wx.request({
            url: this.baseUrl + url,
            data: params,
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            dataType: 'json',
            responseType: 'text',
            success: successCallback,
            complete: function (res) { return wx.hideLoading({}); }
        });
    };
    ApplicationInstance.prototype.updateFamilies = function (data) {
        var list = data.data;
        this.familyList = new Array(list.length);
        for (var i = 0; i < list.length; i++) {
            var element = list[i];
            var family = new family_1.Family(element);
            this.familyList.push(family);
        }
        if (this.familyList && list.length > 0) {
            this.user.FamilyIndex = 0;
            return this.familyList[this.user.FamilyIndex].name;
        }
        return undefined;
    };
    ApplicationInstance.prototype.login = function (callBack) {
        var _this = this;
        wx.showLoading({
            title: '加载中'
        });
        wx.login({
            success: function (res) {
                var keyMap = _this.createSecretKey();
                var params = {
                    APPID: _this.appID,
                    SECRET: _this.secret,
                    CODE: res.code,
                    TIMESTAMP: keyMap.timeStamp,
                    FKEY: keyMap.key
                };
                _this.postRequest('appUser/wxAuthorization', false, params, function (res) {
                    var data = res.data;
                    if (data["code"] == 101) {
                        _this.user.login(data);
                        _this.hotelID = data["map"]["HOTELID"];
                        _this.updateFamilies(data);
                        if (callBack) {
                            callBack();
                        }
                    }
                    else {
                        if (data["map"] && data["map"]["OPENID"]) {
                            _this.user.OpenID = data['map']['OPENID'];
                            // let pages = getCurrentPages();
                        }
                        else {
                            wx.showToast({
                                title: data['msg'],
                                icon: 'none'
                            });
                        }
                    }
                });
            }
        });
    };
    ApplicationInstance.prototype.getDevices = function () {
        if (this.familyList && this.familyList[this.user.FamilyIndex]) {
            var family = this.familyList[this.user.FamilyIndex];
            var callBack = family.getDevices(this);
            if (callBack) {
                var keyMap = this.createSecretKey(this.user.UserID);
                var data = {
                    USERID: this.user.UserID,
                    FAMILYID: family.ID,
                    FKEY: keyMap.key,
                    TIMESTAMP: keyMap.timeStamp
                };
            }
        }
    };
    return ApplicationInstance;
}());
App(new ApplicationInstance());
