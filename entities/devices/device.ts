declare namespace Control {
    interface Button {
        icon : string;
        onIcon : string;
        offIcon : string;
        text : string;
        clickHandler() : number;
        exchangeIcon() : void;
    }

    interface Device {
        picture : string;
        buttonList : Array<Button>;
    }
}