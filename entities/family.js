"use strict";
exports.__esModule = true;
var familyType_1 = require("./familyType");
var airConditioner_1 = require("./devices/airConditioner");
var Family = /** @class */ (function () {
    function Family(parameters) {
        this.startTime = new Date(parseInt(parameters.STARTTIME));
        this.endTime = new Date(parseInt(parameters.ENDTIME));
        this.ID = parameters.FAMILYID;
        this.name = parameters.FAMILYNAME;
        this.type = new familyType_1.FamilyType(parameters.TYPE);
    }
    Family.prototype.getDevices = function (app) {
        var nowTime = new Date();
        if (nowTime < this.startTime || nowTime > this.endTime) {
            return undefined;
        }
        var callBack = function (res) {
            var data = res.data;
            if (data["code"] == 101) {
                var airList = data['map']['airDeviceList'];
                if (airList && airList.length > 0) {
                    app.airConditionerList = new Array(airList.length);
                    for (var i = 0; i < airList.length; i++) {
                        var device = airList[i];
                        var airConditoner = new airConditioner_1.AirConditioner(device);
                        app.airConditionerList.push(airConditoner);
                    }
                }
            }
            else {
                wx.showToast({
                    title: data["msg"],
                    icon: 'none',
                    duration: 1000
                });
            }
        };
        return callBack;
    };
    return Family;
}());
exports.Family = Family;
