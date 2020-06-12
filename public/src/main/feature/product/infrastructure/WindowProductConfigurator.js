const PATH = "public/src/main/feature/product/infrastructure//WindowProductConfigurator.js";

import AbstractproductConfigurator from "public/src/main/feature/product/model/AbstractProductConfigurator.js"
import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"

export default class WindowProductConfigurator extends AbstractproductConfigurator
{
	constructor(productOptions, product)
	{
		super(productOptions, product);
	}

	applyDefaultConfiguration()
	{
		let product = this.product;

		this.productOptions.values().foreach((productOption)=>{
			if(!product.hasAnyProductOptionChoiceOfProductOptionTypeId(productOption.type.id))
				this.saveProductOptionChoice(new ProductOptionChoice(productOption.type, productOption.getAllVariants().get(0)));
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