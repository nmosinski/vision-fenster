import ProductModel from "../model/ProductModel";
import AbstractProductConfigurationService from "../service/configurator/AbstractProductConfigurationService";
import ProductDefinitionParsingService from "../service/ProductDefinitionParsingService";
import productDefinitions from "../productDefinitions";
import FensterProductConfigurationService from "../service/configurator/FensterProductConfigurationService";

class ProductConfigurationServiceFactory {

    public static byModelTitle(title: string): AbstractProductConfigurationService {
        let definitions = ProductDefinitionParsingService.parseFromJson(productDefinitions);

        let productConfigurationService = new FensterProductConfigurationService();
        return productConfigurationService;
    }

    public static byModel(model: ProductModel) {
        return ProductConfigurationServiceFactory.byModelTitle(model.title);
    }
}

export default ProductConfigurationServiceFactory;