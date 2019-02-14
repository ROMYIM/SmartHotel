import { Family } from "./family";

export class Order {

    orderID? : string;
    personCount : number;
    days : number;
    startDate : Date;
    endDate : Date;
    family? : Family;

    constructor(personCount : number, days : number, startDate : Date, endDate : Date) {
        this.personCount = personCount;
        this.days = days;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}