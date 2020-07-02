const PATH = "public/src/main/feature/product/model/AbstractProductConfigurator.js";

import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"
import ProductOption from "public/src/main/feature/product/model/ProductOption.js"
import InvalidProductConfigurationError from "public/src/main/feature/product/model/InvalidProductConfigurationError.js"
import Product from "public/src/main/feature/product/model/Product.js"

import KVMap from "../../../common/util/collections/map/KVMap.js"
import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"


/**
 * @class
 * Class representing an abstract product configurator.
 */
abstract class AbstractProductConfigurator
{
	/**
	 * Create AbstractProductConfigurator.
	 */
	constructor()
	{

	}

	/**
	 * Save a ProductOptionChoice for the given Product and change its price.
	 * @param {ProductOptionChoice} productOptionChoice - The ProductOptionChoice to be saved.
	 * @param {Product} product - The Product to be configured.
	 * @return {Product} The configurated product.
	 * @throws {InvalidProductConfigurationError} If productOptionChoice can not be set.
	 */
	saveProductOptionChoice(productOptionChoice: ProductOptionChoice, product: Product): Product
	{
		if(!(productOptionChoice instanceof ProductOptionChoice))
			throw new VariableTypeError(PATH, "AbstractProductConfigurator.saveProductOptionChoice()", productOptionChoice, "ProductOptionChoice");
		if(!(product instanceof Product))
			throw new VariableTypeError(PATH, "AbstractProductConfigurator.saveProductOptionChoice()", product, "Product");

		if(this.productOptionChoiceIsValid(productOptionChoice, product))
			product.saveProductOptionChoice(productOptionChoice);
		else
			throw new InvalidProductConfigurationError(PATH, "AbstractProductConfigurator.saveProductOptionChoice()", productOptionChoice, product);
		
		product.price = this.calculatePrice(product);
		
		return product;
	}

	/**
	 * Save image of the product.
	 * @param {string} image - The source of the image of the product.
	 * @param {Product} product - The product.
	 */
	saveProductImage(image: string, product: Product): void
	{
		if(!(product instanceof Product))
			throw new VariableTypeError(PATH, "AbstractProductConfigurator.saveProductImage()", product, "Product");

		product.image = image;
	}

	/**
	 * Apply default configuration for a product.
	 * @param {KVMap<string, ProductOption>} productOptions - A map containing the product options (productOption.productOptionType.id -> productOption).
	 * @param {Product} product - The product to be configurated.
	 * @returns {Product} The product after applied defailt configuration.
	 * @abstract
	 */
	abstract applyDefaultConfiguration(productOptions: KVMap<string, ProductOption>, product: Product): Product;

	/**
	 * Check if a ProductOptionChoice is valid for a product.
	 * @param {ProductOptionChoice} productOptionChoice - The ProductOptionChoice containing the productOptionVariant to be set and it's ProductOptionType.
	 * @param {Product} product - The product to be configurated.
	 * @return {boolean} True if ProductOptionChoice is valid for the given product, else false.
	 * @abstract
	 */
	abstract productOptionChoiceIsValid(productOptionChoice: ProductOptionChoice, product: Product): boolean;

	/**
	 * Check if product is valid.
	 * @param {Product} product - The product to be configurated.
	 * @return {boolean} True if product is valid, else false.
	 * @abstract
	 */
	abstract productIsValid(product: Product): boolean;

	/**
	 * Calculate the price of this product.
	 * @param {Product} product - The product to be configurated.
	 * @return {number} The price of this product.
	 * @abstract
	 */
	abstract calculatePrice(product: Product): number;
}

export default AbstractProductConfigurator