//index.js
//获取应用实例
import { IMyApp } from '../../app'

const app = getApp<IMyApp>();
const scenceStyleList : Array<ISceneSytle> = [
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
]

Page({
    data: {
        haveRoom: false,
        roomId: app.familyList ? '你的套间号：' +  app.familyList[app.user.FamilyIndex].name : '下拉获取房间',
        roomList: app.familyList
    },
    
    onLoad() {
        app.login();
    },

    roomButtonClick(event : any) : void {
        if (app.user.RegisterState) {
            let url : string = event.currentTarget.dataset.url;
            wx.navigateTo({
                url : url
            })
        } else {
            wx.showToast({
                title: '注册对话框',
                icon: 'none',
                duration: 1500
            })
        }
    },

    getRoom() : void {
        let message : string;
        let keyMap = app.createSecretKey(app.hotelID);
        const data = {
            HOTELID: app.hotelID,
            OPENID: app.user.OpenID,
            TIMESTAMP: keyMap.timeStamp,
            FKEY: keyMap.timeStamp
        };
        app.postRequest('appHotel/getHotelOrderByOpenId', true, data,
            res => {
                wx.stopPullDownRefresh({});
                if (res.data.code == 101) {
                    const familyName = app.updateFamilies(res.data);
                    if (familyName && this.setData) {
                        this.setData({
                            haveRoom: true,
                            roomId: '你的套间号：' +  familyName,
                            roomList: app.familyList
                        });
                    }    
                } else {
                    message = '你还没入住，请到前台办理入住手续';
                    if (this.setData && message) {
                        this.setData({
                            haveRoom: false,
                            roomId: '下拉获取房间',
                            roomList: []
                        });
                        wx.showToast({
                            title: message,
                            icon: 'none',
                            duration: 1500
                        })
                    }
                }
            }

        )
    },

    getScenceMode() : void {
        if (app.familyList) {
            const userID = app.user.UserID;
            const keyMap = app.createSecretKey(userID);
            const data = {
                USERID: userID,
                FAMILYID: app.familyList[app.user.FamilyIndex].ID,
                TIMESTAMP: keyMap.timeStamp,
                FKEY: keyMap.key
            }
            app.postRequest(
                'appFamily/getSceneMode.do',
                false,
                data,
                res => {
                    if (res.data.code == 101 && this.setData) {
                        let scenceList = res.data.data;
                        for (let i = 0; i < scenceList.length; i++) {
                            const index = i % scenceList.length;
                            scenceList[i].STYLE = scenceStyleList[index];
                        }
                        this.setData({
                            scenceList: scenceList
                        });
                    } else {
                        wx.showToast({
                            title: res.data.msg
                        })
                    }
                }
            )
        } else {

        }
    
    },

    changeRoom(event : any) : void {
        if (event.detail.value && app.familyList) {
            app.user.FamilyIndex = event.detail.value;
            const familyName = app.familyList[app.user.FamilyIndex].name
            this.setData!({
                roomId: '你的套间号：' +  familyName
            })
        }
    },

    onPullDownRefresh() : void {
        this.getRoom();
    },

    bookRoomClick() : void {
        if (app.user.RegisterState) {
            wx.navigateTo({
                url: '/pages/book/book',
            })
        } else {
            console.log('去注册')
        }
    }
})

interface ISceneSytle {
    background : string;
    style : string;
    icon : string;
    textColor : string;
}
