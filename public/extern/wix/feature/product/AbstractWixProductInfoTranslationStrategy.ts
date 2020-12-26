import ProductConfiguration from "../../../../main/feature/product/model/ProductConfiguration";
import WixProductInfo from "./WixProductInfo";

abstract class AbstractWixProductInfoTranslationStrategy
{
    abstract translate(productConfiguration: ProductConfiguration): WixProductInfo;
}

export default AbstractWixProductInfoTranslationStrategy;