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
		return 3;
	}
}