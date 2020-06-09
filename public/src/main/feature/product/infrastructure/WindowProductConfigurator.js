const PATH = "public/src/main/feature/product/infrastructure//WindowProductConfigurator.js";

import AbstractproductConfigurator from "public/src/main/feature/product/model/AbstractProductConfigurator.js"

export default class WindowProductConfigurator extends AbstractproductConfigurator
{
	constructor(productOptions, product)
	{
		super(productOptions, product);
	}

	applyDefaultConfiguration()
	{
		let options = this.allProductOptions;
		let product = this.product;

		this.allProductOptions.values().foreach((productOption)=>{
			if(!product.hasAnyProductOptionVariantOfProductOption(productOption.id))
				this.setProductOptionVariant(productOption.variants.values().get(0));
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