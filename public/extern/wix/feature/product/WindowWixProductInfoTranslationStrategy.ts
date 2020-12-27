import { instantiate } from "../../../../main/common/util/supportive";
import ProductConfiguration from "../../../../main/feature/product/model/ProductConfiguration";
import AbstractWixProductInfoTranslationStrategy from "./AbstractWixProductInfoTranslationStrategy";
import WixProductOptionsInfoService from "./service/WixProductOptionsInfoService";
import WixProductDiscount from "./WixProductDiscount";
import WixProductDiscountType from "./WixProductDiscountType";
import WixProductInfo from "./WixProductInfo";
import WixProductType from "./WixProductType";

class WindowWixProductInfoTranslationStrategy extends AbstractWixProductInfoTranslationStrategy
{
    translate(productConfiguration: ProductConfiguration): WixProductInfo
    {
        return new WixProductInfo(
            'Fenster',
            '',
            '',
            productConfiguration.price,
            new WixProductDiscount(WixProductDiscountType.NONE, ''),
            instantiate(WixProductOptionsInfoService).fromProductOptions(productConfiguration.productOptions),
            false,
            WixProductType.PHYSICAL,
            1,
            true
        );
    }

}

export default WindowWixProductInfoTranslationStrategy;