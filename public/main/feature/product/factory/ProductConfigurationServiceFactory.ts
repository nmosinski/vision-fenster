import ProductModel from "../model/ProductModel";
import ProductConfigurationService from "../service/ProductConfigurationService";
import ProductDefinitionParsingService from "../service/ProductDefinitionParsingService";
import productDefinitions from "../productDefinitions";

class ProductConfigurationServiceFactory {

    public static byModelTitle(title: string): ProductConfigurationService {
        let definitions = ProductDefinitionParsingService.parseFromJson(productDefinitions);

        let productConfigurationService = new ProductConfigurationService(definitions.get(title));
        return productConfigurationService;
    }

    public static byModel(model: ProductModel) {
        return ProductConfigurationServiceFactory.byModelTitle(model.title);
    }
}

export default ProductConfigurationServiceFactory;