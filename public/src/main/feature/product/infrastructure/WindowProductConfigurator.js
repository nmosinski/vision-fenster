const PATH = "public/src/main/feature/product/infrastructure//WindowProductConfigurator.js";

import AbstractProductConfigurator from "public/src/main/feature/product/model/AbstractProductConfigurator.js"
import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"

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
	 */
	applyDefaultConfiguration(productOptions, product)
	{
		productOptions.values().foreach((productOption)=>{
			if(!product.hasAnyProductOptionChoiceOfProductOptionTypeId(productOption.type.id))
				this.saveProductOptionChoice(new ProductOptionChoice(productOption.type, productOption.variants.values().get(0)), product);
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
		return product.price + 1;
	}
}

export default WindowProductConfigurator;