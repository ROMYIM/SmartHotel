import { FamilyType } from "./familyType";
import { IMyApp } from "../app";
import { AirConditioner } from "./devices/airConditioner";

export class Family {

    ID: number;
    name: string;
    type: FamilyType;
    startTime: Date;
    endTime: Date;

    constructor(parameters: any) {
        this.startTime = new Date(parseInt(parameters.STARTTIME));
        this.endTime = new Date(parseInt(parameters.ENDTIME));
        this.ID = parameters.FAMILYID;
        this.name = parameters.FAMILYNAME;
        this.type = new FamilyType(parameters.TYPE);
    }

    getDevices(app : App.AppInstance<IMyApp> & IMyApp) : wx.RequestSuccessCallback | undefined {
        const nowTime = new Date();
        if (nowTime < this.startTime || nowTime > this.endTime) {
            return undefined;
        }
        let callBack : wx.RequestSuccessCallback = res => {
            let data = <Record<string, any>> res.data;
            if (data["code"] == 101) {
                const airList : AnyArray = data['map']['airDeviceList'];
                if (airList && airList.length > 0) {
                    app.airConditionerList = new Array<AirConditioner>(airList.length);
                    for (let i = 0; i < airList.length; i++) {
                        const device = airList[i];
                        const airConditoner = new AirConditioner(device);
                        app.airConditionerList.push(airConditoner);
                    }
                }
            } else {
                wx.showToast({
                    title: data["msg"],
                    icon: 'none',
                    duration: 1000
                })
            }
        }
        return callBack
    }
}