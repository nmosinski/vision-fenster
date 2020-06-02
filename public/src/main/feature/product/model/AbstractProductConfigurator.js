const PATH = "public/src/main/feature/product/model/AbstractProductConfigurator.js";

export default class AbstractProductConfigurator
{
	constructor(allProductOptions, product)
	{
		this.allProductOptions = allProductOptions;
		this.product = product;
	}

	selectProductOptionVariant(productOptionId, productOptionVariantId)
	{
		/*
		for(let optIdx in this.getAllProductOptions())
			if(this.getAllProductOptions()[optIdx]._id === productOptionId)
				for(let varIdx in this.allProductOptions[optIdx].variants)
					{
						let variant = this.allProductOptions[optIdx].variants[varIdx];
						if(variant.id === productOptionVariantId)
							if(this.productOptionVariantCanBeSelected(variant))
							{
								this.product.addProductOptionVariant(variant);
								this.applyDefaultConfiguration();
							}
					}
		*/
		let productOptions = this.allProductOptions;

		for(let idx1 in productOptions)
			if(productOptions[idx1].id === productOptionId)
				for(let idx2 in productOptions[idx1].variants)
					if(productOptions[idx1].variants[idx2].id === productOptionVariantId)
						this.product.setProductOptionVariant(productOptions[idx1].variants[idx2]);
	}

	getValidProductOptionVariants(productOptionId)
	{
		for(let idx in this.allProductOptions)
			if(this.allProductOptions[idx].id === productOptionId)
				return this.allProductOptions[idx].variants.filter((variant)=>this.optionVariantCanBeSelected(variant));
	}

	/**
	 * @abstract
	 */
	applyDefaultConfiguration()
	{

	}

	/**
	 * @abstract
	 */
	productOptionVariantCanBeSelected(option)
	{

	}

	/**
	 * @abstract
	 */
	productIsValid()
	{

	}

	/**
	 * @abstract
	 */
	calculatePrice()
	{

	}

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