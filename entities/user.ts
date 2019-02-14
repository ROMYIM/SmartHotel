
export class User {
    private userID: number;
    userInfo?: wx.UserInfo;
    private registerState: boolean;
    private openID?: string;
    private phone?: string;
    private familyIndex: number;

    constructor(userInfo?: wx.UserInfo) {
        this.userID = 0;
        this.userInfo = userInfo;
        this.registerState = false;
        this.openID = wx.getStorageSync('openID');
        this.familyIndex = -1;
    }

    
    public set UserID(v : number) {
        if (v == NaN || !v) {
            throw "the user id parameter is invaild";
        } else {
            this.userID = v;
        }
    }

    
    public get UserID() : number {
        if (this.userID == 0) {
            throw "you have not signed in yet";    
        } else {
            return this.userID;
        }
    }
    
    
    
    public set OpenID(v : string | undefined) {
        if (v) {
            this.openID = v;
        } else {
            throw "open id is undefined";
        }
    }
    
    
    public get OpenID() : string | undefined {
        return this.openID;
    }

    
    public set Phone(v : string | undefined) {
        if (v) {
            this.phone = v;
            this.registerState = true;
        } else {
            this.registerState = false;
        }
    }
    
    
    public get Phone() : string | undefined {
        return this.phone;
    }

    
    public get RegisterState() : boolean {
        return this.registerState;
    }
    
    
    public set FamilyIndex(v : number) {
        if (v < 0) {
            throw "index can not be samaller than zero";
        } else {
            this.familyIndex = v;
        }
    }

    
    public get FamilyIndex() : number {
        return this.familyIndex;
    }

    checkSession() : void {
        wx.checkSession({
            fail: () => this.openID = undefined,
            complete: res => console.log(res)
        })
    }

    login(data : Record<string, any>) : void {
        this.OpenID = data["map"]["OPENID"];
        this.UserID = data["map"]["USERID"];
        this.Phone = data["map"]["MOBILE"];
    }
    
}