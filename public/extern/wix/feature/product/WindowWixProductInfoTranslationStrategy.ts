import ProductConfiguration from "../../../../main/feature/product/model/ProductConfiguration";
import AbstractWixProductInfoTranslationStrategy from "./AbstractWixProductInfoTranslationStrategy";
import WixProductInfo from "./WixProductInfo";

class WindowWixProductInfoTranslationStrategy extends AbstractWixProductInfoTranslationStrategy
{
    translate(productConfiguration: ProductConfiguration): WixProductInfo
    {
        // const wixProductInfo = new WixProductInfo();
        // ...
        // return wixProductInfo;
    }

}

export default WindowWixProductInfoTranslationStrategy;