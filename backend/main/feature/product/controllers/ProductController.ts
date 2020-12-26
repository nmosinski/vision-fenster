import ProductConfiguration from "../../../../../public/main/feature/product/model/ProductConfiguration";
import AbstractProductConfigurationService from "../../../../../public/main/feature/product/service/configurator/AbstractProductConfigurationService";
import ProductConfigurationServiceFactory from "../../../../../public/main/feature/product/factory/ProductConfigurationServiceFactory";
import ProductModel from "../../../../../public/main/feature/product/model/ProductModel";
import List from "../../../../../public/main/common/util/collections/list/List";
import ProductOption from "../../../../../public/main/feature/product/model/ProductOption";
import ProductOptionType from "../../../../../public/main/feature/product/model/ProductOptionType";
import safeStringify from "../../../../../public/main/common/util/jsTypes/safeStringify";
import Tag from "../../../../../public/main/feature/product/model/Tag";

const PATH = "public/feature/product/controllers/ProductController.js";
const PRODUCT_MODEL_ID = "70b29f09-263e-4eaf-b7f9-8bcdc411b389";


export async function index()
{
    let productModel = await ProductModel.get(PRODUCT_MODEL_ID, ProductModel);
    await productModel.loadChain([ProductOptionType, ProductOption, Tag]);
    /*await productModel.productOptionTypes.foreachAsync(async (el) => {
        await el.load(ProductOption);
        await el.productOptions.foreachAsync(async (opt) => {
            opt.productOptionType = el;
            await opt.load(Tag);
            productOptions.add(opt);
        });
    });
    */
    return JSON.stringify(productModel, safeStringify);
}

/**
 * Create a product.
 * @param {Record<string, unknown>} request The request containing the product information for the product to be created.
 * @returns {string} The id of the new created product.
 */
async function create(request: Record<string, unknown>): Promise<string | null>
{
    let product = new ProductConfiguration(request);
    let configurationService = ProductConfigurationServiceFactory.byModel(await product.productModelQ());

    if (!configurationService.productIsValid(product))
        return null;
    await product.save();
    return product.id;
}

/**
 * Update a product.
 * @param {Record<string, unknown>} request The request containing the product information for the product to be updated.
 */
async function update(request: Record<string, unknown>)
{

}

/**
 * Destroy a product.
 * @param {Record<string, unknown>} request The request containing the product information to for the product to be destroyed.
 */
async function destroy(request: Record<string, unknown>)
{

}