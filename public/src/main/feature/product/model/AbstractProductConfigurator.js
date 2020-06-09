const PATH = "public/src/main/feature/product/model/AbstractProductConfigurator.js";

import Logger from "js-logger"

export default class AbstractProductConfigurator
{
	constructor(allProductOptions, product)
	{
		this.allProductOptions = allProductOptions;
		this.product = product;
	}

	selectProductOptionVariant(productOptionId, productOptionVariantId)
	{
		this.setProductOptionVariant(this.allProductOptions.get(productOptionId).variants.get(productOptionVariantId));
	}

	getValidProductOptionVariants(productOptionId)
	{
		/*
		for(let idx in this.allProductOptions)
			if(this.allProductOptions[idx].id === productOptionId)
				return this.allProductOptions[idx].variants.filter((variant)=>this.optionVariantCanBeSelected(variant));
		*/
	}

	setProductOptionVariant(variant)
	{
		this.product.addProductOptionVariant(variant);
		if(this.allProductOptions.get(variant.productOptionId).type === "Offnungsart")
			this.product.image = variant.image;
		this.product.price = this.calculatePrice();
	}

	/**
	 * @abstract
	 */
	applyDefaultConfiguration(){}

	/**
	 * @abstract
	 */
	productOptionVariantCanBeSelected(option){}

	/**
	 * @abstract
	 */
	productIsValid(){}

	/**
	 * @abstract
	 */
	calculatePrice(){}

	get product()
	{
		return this._product;
	}

	get allProductOptions()
	{
		return this._allProductOptions;
	}

	set product(product)
	{
		this._product = product;
	}

	set allProductOptions(options)
	{
		this._allProductOptions = options;
	}
}