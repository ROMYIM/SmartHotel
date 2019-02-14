"use strict";
exports.__esModule = true;
var User = /** @class */ (function () {
    function User(userInfo) {
        this.userID = 0;
        this.userInfo = userInfo;
        this.registerState = false;
        this.openID = wx.getStorageSync('openID');
        this.familyIndex = -1;
    }
    Object.defineProperty(User.prototype, "UserID", {
        get: function () {
            if (this.userID == 0) {
                throw "you have not signed in yet";
            }
            else {
                return this.userID;
            }
        },
        set: function (v) {
            if (v == NaN || !v) {
                throw "the user id parameter is invaild";
            }
            else {
                this.userID = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "OpenID", {
        get: function () {
            return this.openID;
        },
        set: function (v) {
            if (v) {
                this.openID = v;
            }
            else {
                throw "open id is undefined";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "Phone", {
        get: function () {
            return this.phone;
        },
        set: function (v) {
            if (v) {
                this.phone = v;
                this.registerState = true;
            }
            else {
                this.registerState = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "RegisterState", {
        get: function () {
            return this.registerState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "FamilyIndex", {
        get: function () {
            return this.familyIndex;
        },
        set: function (v) {
            if (v < 0) {
                throw "index can not be samaller than zero";
            }
            else {
                this.familyIndex = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    User.prototype.checkSession = function () {
        var _this = this;
        wx.checkSession({
            fail: function () { return _this.openID = undefined; },
            complete: function (res) { return console.log(res); }
        });
    };
    User.prototype.login = function (data) {
        this.OpenID = data["map"]["OPENID"];
        this.UserID = data["map"]["USERID"];
        this.Phone = data["map"]["MOBILE"];
    };
    return User;
}());
exports.User = User;
