import ProductModel from "../model/ProductModel";
import AbstractProductConfigurationService from "../service/configurator/AbstractProductConfigurationService";
import ProductDefinitionParsingService from "../service/ProductDefinitionParsingService";
import productDefinitions from "../productDefinitions";
import FensterProductConfigurationService from "../window/service/FensterProductConfigurationService";

class ProductConfigurationServiceFactory
{

    public static byModelTitle(title: string): AbstractProductConfigurationService
    {
        const definitions = ProductDefinitionParsingService.parseFromJson(productDefinitions);

        const productConfigurationService = new FensterProductConfigurationService();
        return productConfigurationService;
    }

    public static byModel(model: ProductModel)
    {
        return ProductConfigurationServiceFactory.byModelTitle(model.title);
    }
}

export default ProductConfigurationServiceFactory;