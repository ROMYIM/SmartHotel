export class FamilyType {

    ID: Number;
    name: String;
    price: Number;
    remark?: String;
    pictures?: Array<String>;

    constructor(parameters: any) {
        this.ID = parseInt(parameters.TYPEID);
        this.price = parameters.PRICE ? parseFloat(parameters.PRICE) : 0.00;
        this.name = parameters;
        this.remark = parameters.INFO;
        
    }
}