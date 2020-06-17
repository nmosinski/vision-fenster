const PATH = "public/src/main/feature/product/infrastructure//WindowProductConfigurator.js";

import AbstractProductConfigurator from "public/src/main/feature/product/model/AbstractProductConfigurator.js"
import ProductOptionVariant from "public/src/main/feature/product/model/ProductOptionVariant.js"

class WindowProductConfigurator extends AbstractProductConfigurator
{
	constructor()
	{
		super();
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	applyDefaultConfiguration(productOptions, product)
	{
		productOptions.values().foreach((productOption)=>{
			if(!product.hasAnyProductOptionVariantOfProductOptionTypeId(productOption.type.id))
				this.saveProductOptionVariant(productOption.variants.get(0), product);
		});
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	productOptionChoiceIsValid(productOptionChoice, product)
	{
		return true;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	productIsValid(product)
	{
		return true;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	calculatePrice(product)
	{
		return this.product.price + 1;
	}
}

export default WindowProductConfigurator;