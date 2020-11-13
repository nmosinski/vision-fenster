import WixProductDiscountType from "./WixProductDiscountType";

class WixProductDiscount
{
    type: WixProductDiscountType;
    value: string;
    constructor (type: WixProductDiscountType, value: string)
    {
        this.type = type;
        this.value = value;
    }
}

export default WixProductDiscount;