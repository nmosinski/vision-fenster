const PATH = "public/main/feature/product/infrastructure/configurator/WindowProductConfigurator.js";

import AbstractProductConfigurator from "public/main/feature/product/model/AbstractProductConfigurator.js"
import ProductOptionChoice from "public/main/feature/product/model/ProductOptionChoice.js"
import Product from "public/main/feature/product/model/Product.js"
import ProductOption from "public/main/feature/product/model/ProductOption.js"
import KVMap from "../../../../common/util/collections/map/KVMap.js"

/**
 * @class
 * Class representing a WindowProductConfigurator.
 */
class WindowProductConfigurator extends AbstractProductConfigurator
{
	/**
	 * Create WindowProductConfigurator.
	 */
	constructor()
	{
		super();
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	applyDefaultConfiguration(productOptions: KVMap<string, ProductOption>, product: Product): Product
	{
		productOptions.values().foreach((productOption)=>{
			if(!product.hasAnyProductOptionChoiceOfProductOptionTypeId(productOption.type.id))
				this.saveProductOptionChoice(new ProductOptionChoice(productOption.type, productOption.variants.values().get(0)), product);
		});
		return product;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	saveProductOptionChoice(productOptionChoice: ProductOptionChoice, product: Product): Product
	{
		let ret = super.saveProductOptionChoice(productOptionChoice, product);

		if(productOptionChoice.productOptionType.title === "Offnungsart")
			ret.image = productOptionChoice.productOptionVariant.image;

		return ret;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	productOptionChoiceIsValid(productOptionChoice: ProductOptionChoice, product: Product): boolean
	{
		return true;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	productIsValid(product: Product): boolean
	{
		return true;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	calculatePrice(product: Product): number
	{
		return product.price + 1;
	}
}

export default WindowProductConfigurator;