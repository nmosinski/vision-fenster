const PATH = "public/src/main/feature/product/model/AbstractProductConfigurator.js";

import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"
import ProductOption from "public/src/main/feature/product/model/ProductOption.js"
import InvalidProductConfigurationError from "public/src/main/feature/product/model/InvalidProductConfigurationError.js"
import Product from "public/src/main/feature/product/model/Product.js"

import ClonableKVMap from "public/src/main/common/util/map/ClonableKVMap.js"

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"
import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an abstract product configurator.
 */
class AbstractProductConfigurator
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
	 * @param {product} product - The Product to be configured.
	 * @return {Product} The configurated product.
	 * @throws {InvalidProductConfigurationError} If productOptionChoice can not be set.
	 */
	saveProductOptionChoice(productOptionChoice, product)
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
	 */
	saveProductImage(image, product)
	{
		if(!(product instanceof Product))
			throw new VariableTypeError(PATH, "AbstractProductConfigurator.saveProductImage()", product, "Product");

		product.image = image;
	}

	/**
	 * Apply default configuration for a product.
	 * @param {Map<ProductOption>} productOptions - A map containing the product options (productOption.productOptionType.id -> productOption).
	 * @param {Product} product - The product to be configurated.
	 * @abstract
	 */
	applyDefaultConfiguration(productOptions, product){throw new NotImplementedError(PATH, "AbstractProductConfigurator.applyDefaultConfiguration()");}

	/**
	 * Check if a ProductOptionChoice is valid for a product.
	 * @param {ProductOptionChoice} productOptionChoice - The ProductOptionChoice containing the productOptionVariant to be set and it's ProductOptionType.
	 * @param {Product} product - The product to be configurated.
	 * @abstract
	 */
	productOptionChoiceIsValid(productOptionChoice, product){throw new NotImplementedError(PATH, "AbstractProductConfigurator.productOptionChoiceIsValid()");}

	/**
	 * Check if product is valid.
	 * @param {Product} product - The product to be configurated.
	 * @return {boolean} True if product is valid, else false.
	 * @abstract
	 */
	productIsValid(product){throw new NotImplementedError(PATH, "AbstractProductConfigurator.productIsValid()");}

	/**
	 * Calculate the price of this product.
	 * @param {Product} product - The product to be configurated.
	 * @return {number} The price of this product.
	 * @abstract
	 */
	calculatePrice(product){throw new NotImplementedError(PATH, "AbstractProductConfigurator.calculatePrice()");}
}

export default AbstractProductConfigurator