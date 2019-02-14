
const airOnPicture = '/resources/control/airconditioner/air_icon_on.png';
const airOffPicture = '/resources/control/airconditioner/air_icon_off.png';
const airColdPicture = '/resources/control/airconditioner/air_icon_cold.png';
const airHotPicture = "/resources/control/airconditioner/air_icon_hot.png";
const airWaterPicture = "/resources/control/airconditioner/air_icon_water.png";
const airWindPicture = "/resources/control/airconditioner/air_icon_bigbig.png";
const airSpeedLittlePicture = "/resources/control/airconditioner/air_icon_speed_big.png";
const airSpeedMiddlePicture = "/resources/control/airconditioner/air_icon_speed_bigbig.png";
const airSpeedLargePicture = "/resources/control/airconditioner/air_icon_speed_bigbigbig.png";

export class AirConditioner implements Control.Device {


    picture : string;
    buttonList : Array<Control.Button>;
    commandCode : AirCode;
    device : any

    constructor(device : any) {
        this.picture = airOffPicture;
        this.device = device;
        this.buttonList = new Array<Control.Button>(9);
        this.commandCode = new AirCode();
        const switchButton = new AirConditionerButton(
            '/resources/control/airconditioner/air_button_swith_press.png', 
            '/resources/control/airconditioner/air_button_swith_nor.png', 
            '开关', 
            () => {
                if (this.picture == airOffPicture) {
                    this.picture = airOnPicture;
                    return 2;
                } else {
                    this.picture = airOffPicture;
                    return 1;
                }
                
            }
        );
        this.buttonList.push(switchButton);
        const windButton = new AirConditionerButton(
            '/resources/control/airconditioner/air_button_supply_press.png',
            '/resources/control/airconditioner/air_button_supply_nor.png',
            '送风',
            () => {
                if (this.picture == airOffPicture) {
                    return 1;
                } else {
                    this.picture = airWindPicture;
                    const modeIndex = this.commandCode.getButtonIndex();
                    this.buttonList[modeIndex].exchangeIcon();
                    return this.commandCode.getCommandCode();
                }
            }
        );
        this.buttonList.push(windButton);
        const speedButton = new AirConditionerButton(
            '/resources/control/airconditioner/air_button_swith_press.png',
            '/resources/control/airconditioner/air_button_swith_nor.png',
            '风速',
            () => {
                if (this.picture == airOffPicture) {
                    return 1;
                } else {
                    this.commandCode.WindSpeed = this.commandCode.WindSpeed % 3 + 1;
                    switch (this.commandCode.WindSpeed) {
                        case 1:
                            this.picture = airSpeedLargePicture;
                            break;
                        case 2:
                            this.picture = airSpeedMiddlePicture;
                            break;
                        case 3:
                            this.picture = airSpeedLittlePicture;
                            break;
                        default:
                            break;
                    }
                    return this.commandCode.getCommandCode();
                }
            }
        );
        this.buttonList.push(speedButton);
        const temperatureButton = new AirTemperature(this.commandCode.Temperature + 15);
        const temperatureDownButton = new AirConditionerButton(
            '/resources/control/airconditioner/air_button_cool_press.png',
            '/resources/control/airconditioner/air_button_cool_nor.png',
            '降温',
            () => {
               if (this.picture == airOffPicture) {
                    return 1;
                } else {
                    if (this.commandCode.Temperature > 1) {
                        this.commandCode.Temperature--;
                        temperatureButton.Value = this.commandCode.Temperature + 15;
                    }
                    return this.commandCode.getCommandCode();
                } 
            }
        );
        this.buttonList.push(temperatureDownButton);
        this.buttonList.push(temperatureButton);
        const temperatureUpButton = new AirConditionerButton(
            '/resources/control/airconditioner/air_button_warm_press.png',
            '/resources/control/airconditioner/air_button_warm_nor.png',
            '升温',
            () => {
                if (this.picture == airOffPicture) {
                    return 1;
                } else {
                    if (this.commandCode.Temperature < 15) {
                        this.commandCode.Temperature++;
                        temperatureButton.Value = this.commandCode.Temperature + 15;
                    }
                    return this.commandCode.getCommandCode();
                } 
            }
        );
        this.buttonList.push(temperatureUpButton);
        const wetButton = new AirConditionerButton(
            '/resources/control/airconditioner/air_button_water_press.png',
            '/resources/control/airconditioner/air_button_water_nor.png',
            '除湿',
            () => {
                if (this.picture == airOffPicture) {
                    return 1;
                } else {
                    this.picture = airWaterPicture;
                    const modeIndex = this.commandCode.getButtonIndex();
                    this.buttonList[modeIndex].exchangeIcon();
                    return this.commandCode.getCommandCode();
                } 
            }
        );
        this.buttonList.push(wetButton);
        const hotButton = new AirConditionerButton(
            '/resources/control/airconditioner/air_button_hot_press.png',
            '/resources/control/airconditioner/air_button_hot_nor.png',
            '制热',
            () => {
                if (this.picture == airOffPicture) {
                    return 1;
                } else {
                    this.picture = airHotPicture
                    const modeIndex = this.commandCode.getButtonIndex();
                    this.buttonList[modeIndex].exchangeIcon();
                    return this.commandCode.getCommandCode();
                } 
            }
        );
        this.buttonList.push(hotButton);
        const coldButton = new AirConditionerButton(
            '/resources/control/airconditioner/air_button_cold_press.png',
            '/resources/control/airconditioner/air_button_cold_nor.png',
            '制冷',
            () => {
               if (this.picture == airOffPicture) {
                    return 1;
                } else {
                    this.picture = airColdPicture
                    const modeIndex = this.commandCode.getButtonIndex();
                    this.buttonList[modeIndex].exchangeIcon();
                    return this.commandCode.getCommandCode();
                }  
            }
        );
        this.buttonList.push(coldButton);
    }
}

class AirTemperature implements Control.Button {
    icon : string;
    onIcon : string;
    offIcon : string;
    text : string;
    private value : number;

    constructor(temperature : number) {
        this.icon = this.offIcon = this.onIcon = '';
        this.text = '温度';
        this.value = temperature;
    }

    clickHandler() : number {
        return 0;
    }

    exchangeIcon() : void {
        return ;
    }

    public set Value(v : number) {
        if (v >= 16 && v <= 30) {
            this.value = v;
        }
    }

    
    public get Value() : number {
        return this.value;
    }
    
    
}

class AirConditionerButton implements Control.Button {
    icon : string;
    onIcon : string;
    offIcon : string;
    text : string;
    clickEvent : () => number;

    constructor(onIcon : string, offIcon : string, text : string, clickEvent : () => number) {
        this.onIcon = onIcon;
        this.offIcon = offIcon;
        this.text = text;
        this.clickEvent = clickEvent;
        this.icon = offIcon;
    }

    exchangeIcon() : void {
        let iconTemp = this.onIcon;
        this.onIcon = this.offIcon;
        this.offIcon = iconTemp;
    }

    clickHandler() : number {
        const commandCode = this.clickEvent();
        this.exchangeIcon();
        return commandCode;
    }
}

class AirCode {
    private mode : number;
    private windMode : number; 
    private windSpeed : number; 
    private temperature : number;
    constructor() {
        this.mode = 0;
        this.windMode = 0;
        this.windSpeed = 0;
        this.temperature = 1;
    }

    
    public set Mode(v : number) {
        this.mode = v;
    }
    
    
    public get Mode() : number {
        return this.mode;
    }

    
    public set WindMode(v : number) {
        this.windMode = v;
    }
    
    
    public get WindMode() : number {
        return this.windMode;
    }

    
    public set WindSpeed(v : number) {
        this.windSpeed = v;
    }
    
    
    public get WindSpeed() : number {
        return this.windSpeed;
    }
    
    
    public set Temperature(v : number) {
        this.temperature = v;
    }
    
    
    public get Temperature() : number {
        return this.temperature;
    }
    

    getCommandCode() : number {
        const commandCode = this.temperature + 
        this.windSpeed * 15 + 
        this.windMode * 60 + 
        this.mode * 120 + 2;
        return commandCode;
    }

    getButtonIndex() : number {
        let index = 0;
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
    }
}