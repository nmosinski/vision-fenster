import ProductConfiguration from "../../../../../public/main/feature/product/model/ProductConfiguration";
import AbstractProductConfigurationService from "../../../../../public/main/feature/product/service/configurator/AbstractProductConfigurationService";
import ProductConfigurationServiceFactory from "../../../../../public/main/feature/product/factory/ProductConfigurationServiceFactory";
import ProductModel from "../../../../../public/main/feature/product/model/ProductModel";
import List from "../../../../../public/main/common/util/collections/list/List";
import ProductOption from "../../../../../public/main/feature/product/model/ProductOption";
import ProductOptionType from "../../../../../public/main/feature/product/model/ProductOptionType";
import safeStringify from "../../../../../public/main/common/util/jsTypes/safeStringify";
import Tag from "../../../../../public/main/feature/product/model/Tag";

const PATH = "public/feature/product/controllers/ProductConfigurationController.js";

// This controller should be also able to store normal products.
// Question -> How to manage this?
// create

// typesize product configuration
// validate
// not valid ->
// valid ->
// create configuration
// create product

// update

// typesize product configuration
// validate
// not valid ->
// valid ->
// update configuration
// update product



/**
 * Create a product configuration.
 * @param requestData The request containing the information for the product configuration to be created.
 * @returns {string} The id of the new created configuration.
 */
async function create(requestData): Promise<string | never>
{
    const productConfiguration = new ProductConfiguration(requestData);

    return null;
}

/**
 * Update a product configuration.
 * @param {Record<string, unknown>} request The request containing the information for the product configuration to be updated.
 */
async function update(request: Record<string, unknown>)
{

}

/**
 * Destroy a product configuration.
 * @param {Record<string, unknown>} request The request containing the information to for the product configuration to be destroyed.
 */
async function destroy(request: Record<string, unknown>)
{

}