"use strict";
exports.__esModule = true;
var airOnPicture = '/resources/control/airconditioner/air_icon_on.png';
var airOffPicture = '/resources/control/airconditioner/air_icon_off.png';
var airColdPicture = '/resources/control/airconditioner/air_icon_cold.png';
var airHotPicture = "/resources/control/airconditioner/air_icon_hot.png";
var airWaterPicture = "/resources/control/airconditioner/air_icon_water.png";
var airWindPicture = "/resources/control/airconditioner/air_icon_bigbig.png";
var airSpeedLittlePicture = "/resources/control/airconditioner/air_icon_speed_big.png";
var airSpeedMiddlePicture = "/resources/control/airconditioner/air_icon_speed_bigbig.png";
var airSpeedLargePicture = "/resources/control/airconditioner/air_icon_speed_bigbigbig.png";
var AirConditioner = /** @class */ (function () {
    function AirConditioner(device) {
        var _this = this;
        this.picture = airOffPicture;
        this.device = device;
        this.buttonList = new Array(9);
        this.commandCode = new AirCode();
        var switchButton = new AirConditionerButton('/resources/control/airconditioner/air_button_swith_press.png', '/resources/control/airconditioner/air_button_swith_nor.png', '开关', function () {
            if (_this.picture == airOffPicture) {
                _this.picture = airOnPicture;
                return 2;
            }
            else {
                _this.picture = airOffPicture;
                return 1;
            }
        });
        this.buttonList.push(switchButton);
        var windButton = new AirConditionerButton('/resources/control/airconditioner/air_button_supply_press.png', '/resources/control/airconditioner/air_button_supply_nor.png', '送风', function () {
            if (_this.picture == airOffPicture) {
                return 1;
            }
            else {
                _this.picture = airWindPicture;
                var modeIndex = _this.commandCode.getButtonIndex();
                _this.buttonList[modeIndex].exchangeIcon();
                return _this.commandCode.getCommandCode();
            }
        });
        this.buttonList.push(windButton);
        var speedButton = new AirConditionerButton('/resources/control/airconditioner/air_button_swith_press.png', '/resources/control/airconditioner/air_button_swith_nor.png', '风速', function () {
            if (_this.picture == airOffPicture) {
                return 1;
            }
            else {
                _this.commandCode.WindSpeed = _this.commandCode.WindSpeed % 3 + 1;
                switch (_this.commandCode.WindSpeed) {
                    case 1:
                        _this.picture = airSpeedLargePicture;
                        break;
                    case 2:
                        _this.picture = airSpeedMiddlePicture;
                        break;
                    case 3:
                        _this.picture = airSpeedLittlePicture;
                        break;
                    default:
                        break;
                }
                return _this.commandCode.getCommandCode();
            }
        });
        this.buttonList.push(speedButton);
        var temperatureButton = new AirTemperature(this.commandCode.Temperature + 15);
        var temperatureDownButton = new AirConditionerButton('/resources/control/airconditioner/air_button_cool_press.png', '/resources/control/airconditioner/air_button_cool_nor.png', '降温', function () {
            if (_this.picture == airOffPicture) {
                return 1;
            }
            else {
                if (_this.commandCode.Temperature > 1) {
                    _this.commandCode.Temperature--;
                    temperatureButton.Value = _this.commandCode.Temperature + 15;
                }
                return _this.commandCode.getCommandCode();
            }
        });
        this.buttonList.push(temperatureDownButton);
        this.buttonList.push(temperatureButton);
        var temperatureUpButton = new AirConditionerButton('/resources/control/airconditioner/air_button_warm_press.png', '/resources/control/airconditioner/air_button_warm_nor.png', '升温', function () {
            if (_this.picture == airOffPicture) {
                return 1;
            }
            else {
                if (_this.commandCode.Temperature < 15) {
                    _this.commandCode.Temperature++;
                    temperatureButton.Value = _this.commandCode.Temperature + 15;
                }
                return _this.commandCode.getCommandCode();
            }
        });
        this.buttonList.push(temperatureUpButton);
        var wetButton = new AirConditionerButton('/resources/control/airconditioner/air_button_water_press.png', '/resources/control/airconditioner/air_button_water_nor.png', '除湿', function () {
            if (_this.picture == airOffPicture) {
                return 1;
            }
            else {
                _this.picture = airWaterPicture;
                var modeIndex = _this.commandCode.getButtonIndex();
                _this.buttonList[modeIndex].exchangeIcon();
                return _this.commandCode.getCommandCode();
            }
        });
        this.buttonList.push(wetButton);
        var hotButton = new AirConditionerButton('/resources/control/airconditioner/air_button_hot_press.png', '/resources/control/airconditioner/air_button_hot_nor.png', '制热', function () {
            if (_this.picture == airOffPicture) {
                return 1;
            }
            else {
                _this.picture = airHotPicture;
                var modeIndex = _this.commandCode.getButtonIndex();
                _this.buttonList[modeIndex].exchangeIcon();
                return _this.commandCode.getCommandCode();
            }
        });
        this.buttonList.push(hotButton);
        var coldButton = new AirConditionerButton('/resources/control/airconditioner/air_button_cold_press.png', '/resources/control/airconditioner/air_button_cold_nor.png', '制冷', function () {
            if (_this.picture == airOffPicture) {
                return 1;
            }
            else {
                _this.picture = airColdPicture;
                var modeIndex = _this.commandCode.getButtonIndex();
                _this.buttonList[modeIndex].exchangeIcon();
                return _this.commandCode.getCommandCode();
            }
        });
        this.buttonList.push(coldButton);
    }
    return AirConditioner;
}());
exports.AirConditioner = AirConditioner;
var AirTemperature = /** @class */ (function () {
    function AirTemperature(temperature) {
        this.icon = this.offIcon = this.onIcon = '';
        this.text = '温度';
        this.value = temperature;
    }
    AirTemperature.prototype.clickHandler = function () {
        return 0;
    };
    AirTemperature.prototype.exchangeIcon = function () {
        return;
    };
    Object.defineProperty(AirTemperature.prototype, "Value", {
        get: function () {
            return this.value;
        },
        set: function (v) {
            if (v >= 16 && v <= 30) {
                this.value = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    return AirTemperature;
}());
var AirConditionerButton = /** @class */ (function () {
    function AirConditionerButton(onIcon, offIcon, text, clickEvent) {
        this.onIcon = onIcon;
        this.offIcon = offIcon;
        this.text = text;
        this.clickEvent = clickEvent;
        this.icon = offIcon;
    }
    AirConditionerButton.prototype.exchangeIcon = function () {
        var iconTemp = this.onIcon;
        this.onIcon = this.offIcon;
        this.offIcon = iconTemp;
    };
    AirConditionerButton.prototype.clickHandler = function () {
        var commandCode = this.clickEvent();
        this.exchangeIcon();
        return commandCode;
    };
    return AirConditionerButton;
}());
var AirCode = /** @class */ (function () {
    function AirCode() {
        this.mode = 0;
        this.windMode = 0;
        this.windSpeed = 0;
        this.temperature = 1;
    }
    Object.defineProperty(AirCode.prototype, "Mode", {
        get: function () {
            return this.mode;
        },
        set: function (v) {
            this.mode = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AirCode.prototype, "WindMode", {
        get: function () {
            return this.windMode;
        },
        set: function (v) {
            this.windMode = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AirCode.prototype, "WindSpeed", {
        get: function () {
            return this.windSpeed;
        },
        set: function (v) {
            this.windSpeed = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AirCode.prototype, "Temperature", {
        get: function () {
            return this.temperature;
        },
        set: function (v) {
            this.temperature = v;
        },
        enumerable: true,
        configurable: true
    });
    AirCode.prototype.getCommandCode = function () {
        var commandCode = this.temperature +
            this.windSpeed * 15 +
            this.windMode * 60 +
            this.mode * 120 + 2;
        return commandCode;
    };
    AirCode.prototype.getButtonIndex = function () {
        var index = 0;
        switch (this.Mode) {
            case 4:
                index = 1;
                break;
            case 3:
                index = 6;
                break;
            case 2:
                index = 7;
                break;
            case 0:
                index = 8;
                break;
            default:
                break;
        }
        return index;
    };
    return AirCode;
}());
