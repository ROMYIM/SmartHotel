import { IMyApp } from "../../app";
import { formatTime } from "../../utils/util";

const app = getApp<IMyApp>();


Page({
    data: {
        startDate: formatTime(new Date()),
        enterDate: formatTime(new Date()),
        leaveDate: formatTime(new Date()),
        year: new Date().getFullYear() + 1,
        list: [],
        personCount: 1,
        days: 1,
        calendarOpen: false,
        dateTarget: 'enter',
        date: formatTime(new Date()).fullDate.replace(/-/g, '/')
    },

    onLoad() : void {
        const hotelID = app.hotelID;
        const keyMap = app.createSecretKey(hotelID);
        const data = {
            HOTELID: hotelID,
            FKEY: keyMap.key,
            TIMESTAMP: keyMap.timeStamp
        }
        app.postRequest(
            'appHotel/getHotelType.do',
            true,
            data,
            res => {
                if (res.data.code == 101) {
                    let typeList = res.data.data;
                    for (let i = 0; i < typeList.length; i++) {
                        if (typeList[i].INFO && typeList[i].INFO.length > 30) {
                            typeList[i].INFO = typeList[i].INFO.subString(0, 30) + '...';
                        }
                    }
                    this.setData!({
                        list: typeList
                    })
                } else {
                    wx.showToast({
                        title: '订房请求失败',
                        icon: 'none'
                    });
                }
            }
        )
    },

    onReady() : void {
        let leaveDate = new Date();
        leaveDate.setDate(leaveDate.getDate() + 1);
        this.setData!({
            leaveDate: formatTime(leaveDate)
        })
    },

    enterDateChange(event : any) : void {
        const date = new Date(event.detail.value.replace(/-/g, '/'));
        this.setData!({
            enterDate: formatTime(date),
            leaveDate: formatTime(date),
            startDate: formatTime(date)
        })
    }, 

    leaveDateChange(event : any) : void {
        const enterDate = new Date(this.data.enterDate.fullDate.replace(/-/g, '/'));
        const date = new Date(event.detail.value.replace(/-/g, '/') + " 23:59:59");
        let days =  (date.getTime() - enterDate.getTime()) / (24 * 60 * 60 * 1000); 
        days = parseInt(days.toString())
        this.setData!({
            leaveDate: formatTime(date),
            days: days
        })  
    }
})