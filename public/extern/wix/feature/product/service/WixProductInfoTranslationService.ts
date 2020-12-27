import ProductConfiguration from "../../../../../main/feature/product/model/ProductConfiguration";
import ProductModel from "../../../../../main/feature/product/model/ProductModel";
import { ProductModels } from "../../../../../main/feature/product/productModels";
import AbstractWixProductInfoTranslationStrategy from "../AbstractWixProductInfoTranslationStrategy";
import WindowWixProductInfoTranslationStrategy from "../WindowWixProductInfoTranslationStrategy";
import WixProductInfo from "../WixProductInfo";

class WixProductInfoTranslationService
{
    public fromProductConfiguration(productConfiguration: ProductConfiguration): WixProductInfo
    {
        let strategy: AbstractWixProductInfoTranslationStrategy;

        switch (productConfiguration.productModel.title)
        {
            case ProductModels.FENSTER:
                strategy = new WindowWixProductInfoTranslationStrategy();
        }

        return strategy.translate(productConfiguration);
    }
}

export default WixProductInfoTranslationService;