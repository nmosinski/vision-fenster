import AbstractProductConfigurationService from "./AbstractProductConfigurationService";
import ProductDefinitionParsingService from "../ProductDefinitionParsingService";
import productDefinitions from "../../productDefinitions";
import ProductOption from "../../model/ProductOption";
import Product from "../../model/Product";
import ProductConfigurationServiceFactory from "../../factory/ProductConfigurationServiceFactory";
import ProductDefinition from "../../model/ProductDefinition";
import { FensterProductOptionTypes } from "../../productOptionTypes";
import { ProductModels } from "../../productModels";

class FensterProductConfigurationService extends AbstractProductConfigurationService {

    constructor(productDefinition?: ProductDefinition) {
        super((productDefinition) ? productDefinition : ProductDefinitionParsingService.parseFromJson(productDefinitions).get(ProductModels.FENSTER));
    }

    beforeSetOption(productOption: ProductOption, product: Product): void {

    }

    afterSetOption(productOption: ProductOption, product: Product): void {
        if (productOption.productOptionType.title === FensterProductOptionTypes.PROFIL)
            product.image = productOption.image;
    }

    calculatePrice(product: Product): void {
        product.price = 2;
    }
}

export default FensterProductConfigurationService;