import IComparable from "../../../../main/common/util/IComparable";

class WixProductOptionsChoice implements IComparable
{
    value: string;
    description: string;
    inStock: boolean;
    visible: boolean;
    constructor (value: string, description: string, inStock: boolean, visible: boolean)
    {
        this.value = value;
        this.description = description;
        this.inStock = inStock;
        this.visible = visible;
    }

    equals(object: object): boolean
    {
        return object instanceof WixProductOptionsChoice
            && this.value === object.value
            && this.description === object.description
            && this.inStock === object.inStock
            && this.visible === object.visible;
    }

}

export default WixProductOptionsChoice;