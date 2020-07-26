import Product from "../../../../../public/main/feature/product/model/Product";
import ProductConfigurationService from "../../../../../public/main/feature/product/service/ProductConfigurationService";
import ProductConfigurationServiceFactory from "../../../../../public/main/feature/product/factory/ProductConfigurationServiceFactory";

const PATH = "public/feature/product/controllers/ProductController.js";

class ProductController {


    /**
     * Create a product.
     * @param {object} request The request containing the product information for the product to be created.
     * @returns {string} The id of the new created product.
     */
    async create(request: object): Promise<string | null> {
        let product = new Product(request);
        let configurationService = ProductConfigurationServiceFactory.byModel(await product.productModelQ());

        if (!configurationService.productIsValid(product))
            return null;
        await product.save();
        return product.id;
    }

    /**
     * Update a product.
     * @param {object} request The request containing the product information for the product to be updated.
     */
    async update(request: object) {

    }

    /**
     * Destroy a product.
     * @param {object} request The request containing the product information to for the product to be destroyed.
     */
    async destroy(request: object) {

    }
}

export default ProductController;