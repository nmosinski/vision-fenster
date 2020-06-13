const PATH = "public/src/main/feature/product/infrastructure//WindowProductConfigurator.js";

import AbstractProductConfigurator from "public/src/main/feature/product/model/AbstractProductConfigurator.js"
import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"

class WindowProductConfigurator extends AbstractProductConfigurator
{
	constructor(productOptions, product)
	{
		super(productOptions, product);
	}

	applyDefaultConfiguration()
	{
		let product = this._product;

		this._productOptions.values().foreach((productOption)=>{
			if(!product.hasAnyProductOptionChoiceOfProductOptionTypeId(productOption.type.id))
				this.saveProductOptionChoice(new ProductOptionChoice(productOption.type, productOption.variants.values().get(0)));
		});
	}

	optionCanBeSelected(option)
	{
		return true;
	}

	productIsValid()
	{
		return true;
	}

	calculatePrice()
	{
		return this.product.price + 1;
	}
}

export default WindowProductConfigurator;