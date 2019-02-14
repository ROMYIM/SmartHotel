import { User } from "./entities/user";
import { Family } from "./entities/family";
import { md5 } from "./utils/util";
import { AirConditioner } from "./entities/devices/airConditioner";

//app.ts
export interface IMyApp {
    //  readonly baseUrl: String
    recorderManager?: wx.RecorderManager;
    scoketClient?: wx.SocketTask;
    user: User;
    familyList?: Array<Family>;
    airConditionerList?: Array<AirConditioner>;
    hotelID? : string;
    userInfoReadyCallback?(res: wx.UserInfo): void
    createSecretKey(encryptCode?: string | number): { key: string, timeStamp: number }
    postRequest(url: string, needAuthorzation: boolean, params: any, successCallback: (res: any)  => void): void
    login(callBack? : () => void) : void
    updateFamilies(data : any) : string | undefined
    // globalData: {
    //   userInfo?: wx.UserInfo
    // }
}


class ApplicationInstance implements App.AppInstance<IMyApp> {

    private readonly appID: String = 'wxca20cf2091c1f4b9';
    private readonly secret: String = 'a3c50569004cd6bd101b727f2a002055';
    readonly baseUrl: String = 'https://mkcloud.gotechcn.cn/smarthotel/';
    private readonly secretKey: String = 'p!P2QklnjGGaZKlw';
    
    recorderManager?: wx.RecorderManager;
    scoketClient?: wx.SocketTask;
    user: User;
    familyList?: Array<Family>;
    airConditionerList?: Array<AirConditioner>;
    hotelID?: string;
    userInfoReadyCallback?: (res: wx.UserInfo) => void

    constructor() {
        this.user = new User();
        this.userInfoReadyCallback = undefined;
        this.recorderManager = wx.getRecorderManager();
    }

    onLaunch(): void {
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                    success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    this.user.userInfo = res.userInfo
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res.userInfo)
                    }
                    }
                })
                }
            }
        })
        const phone = wx.getStorageSync('phone');
        this.user.Phone = phone;
    }

    createSecretKey(encryptCode?: string | number): { key: string, timeStamp: number } {
        let timeStamp = new Date().getTime();
        if (!encryptCode) {
            encryptCode = this.secret.toString();
        } 
        let key = encryptCode.toString() + timeStamp + this.secretKey;
        return {
            key: md5(key),
            timeStamp: timeStamp
        }
    }

    postRequest(url: string, needAuthorzation: boolean, params: any, successCallback: (res: any)  => void): void {
        if (needAuthorzation) {
            this.user.checkSession();
            if (!this.user.OpenID) {
                this.login();
                return ;
            }
            if (!this.user.RegisterState) {
                wx.showToast({
                    title: '注册对话框',
                    icon: 'none'
                })
                return ;
            }
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            url: this.baseUrl + url,
            data: params,
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            dataType: 'json',
            responseType: 'text',
            success: successCallback,
            complete: res => wx.hideLoading({})
        })
    }

    updateFamilies(data : any) : string | undefined {
        let list : AnyArray = data.data;
        this.familyList = new Array<Family>(list.length);
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let family = new Family(element);
            this.familyList.push(family);
        }
        if (this.familyList && list.length > 0) {
            this.user.FamilyIndex = 0;
            return this.familyList[this.user.FamilyIndex].name;
        } 
        return undefined;
    }

    login(callBack? : () => void): void {
        wx.showLoading({
            title: '加载中',
        });
        wx.login({
            success: res => {
                let keyMap = this.createSecretKey();
                let params = {
                    APPID: this.appID,
                    SECRET: this.secret,
                    CODE: res.code,
                    TIMESTAMP: keyMap.timeStamp,
                    FKEY: keyMap.key
                } 
                this.postRequest(
                    'appUser/wxAuthorization',
                    false,
                    params,
                    res => {
                        let data = <Record<string, any>> res.data;
                        if (data["code"] == 101) {
                            this.user.login(data);
                            this.hotelID = data["map"]["HOTELID"];
                            this.updateFamilies(data)
                            if (callBack) {
                                callBack();
                            }
                        } else {
                            if (data["map"] && data["map"]["OPENID"]) {
                                this.user.OpenID = data['map']['OPENID'];
                                // let pages = getCurrentPages();
                            } else {
                                wx.showToast({
                                title: data['msg'],
                                icon: 'none'
                                })
                            }
                        }
                    }
                )      
            }
        })
    }

    getDevices() : void {
        if (this.familyList && this.familyList[this.user.FamilyIndex]) {
            const family = this.familyList[this.user.FamilyIndex];
            const callBack = family.getDevices(this);
            if (callBack) {
                const keyMap = this.createSecretKey(this.user.UserID);
                const data = {
                    USERID: this.user.UserID,
                    FAMILYID: family.ID,
                    FKEY: keyMap.key,
                    TIMESTAMP: keyMap.timeStamp
                }
            }
        }
    }
}

App<IMyApp>(new ApplicationInstance())
