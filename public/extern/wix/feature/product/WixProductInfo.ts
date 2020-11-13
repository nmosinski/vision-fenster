import WixProductDiscount from "./WixProductDiscount";
import WixProductOptionsInfo from "./WixProductOptionsInfo";

class WixProductInfo
{
    name: string;
    description: string;
    sku: string;
    price: number;
    discount: WixProductDiscount;
    productOptions: WixProductOptionsInfo;
    manageVariants: boolean;
    productType: string;
    weight: number;
    visible: boolean;
    constructor (name: string, description: string, sku: string, price: number, discount: WixProductDiscount, productOptions: WixProductOptionsInfo, manageVariants: boolean, productType: string, weight: number, visible: boolean)
    {
        this.name = name;
        this.description = description;
        this.sku = sku;
        this.price = price;
        this.discount = discount;
        this.productOptions = productOptions;
        this.manageVariants = manageVariants;
        this.productType = productType;
        this.weight = weight;
        this.visible = visible;
    }
}

export default WixProductInfo;