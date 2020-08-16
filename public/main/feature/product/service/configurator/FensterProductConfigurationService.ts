import AbstractProductConfigurationService from "./AbstractProductConfigurationService";
import ProductDefinitionParsingService from "../ProductDefinitionParsingService";
import productDefinitions from "../../productDefinitions";
import ProductOption from "../../model/ProductOption";
import Product from "../../model/Product";
import ProductConfigurationServiceFactory from "../../factory/ProductConfigurationServiceFactory";

class FensterProductConfigurationService extends AbstractProductConfigurationService {

    constructor() {
        super(ProductDefinitionParsingService.parseFromJson(productDefinitions).get("fenster"));
    }

    beforeSetOption(productOption: ProductOption, product: Product): void {

    }

    afterSetOption(productOption: ProductOption, product: Product): void {
        if (productOption.productOptionType.title === "profil")
            product.image = productOption.image;
    }

    calculatePrice(product: Product): void {
        product.price = 2;
    }
}

export default FensterProductConfigurationService;