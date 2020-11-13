import WixProductInfo from "./WixProductInfo";

class WixProduct
{
    id: string;
    productInfo: WixProductInfo;
    constructor (id: string, productInfo: WixProductInfo)
    {
        this.id = id;
        this.productInfo = productInfo;
    }
}

export default WixProduct;