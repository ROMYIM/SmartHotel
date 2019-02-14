"use strict";
exports.__esModule = true;
var FamilyType = /** @class */ (function () {
    function FamilyType(parameters) {
        this.ID = parseInt(parameters.TYPEID);
        this.price = parameters.PRICE ? parseFloat(parameters.PRICE) : 0.00;
        this.name = parameters;
        this.remark = parameters.INFO;
    }
    return FamilyType;
}());
exports.FamilyType = FamilyType;
