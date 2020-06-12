const PATH = "public/src/main/feature/product/model/AbstractProductConfigurator.js";

import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"
import ProductOption from "public/src/main/feature/product/model/ProductOption.js"

import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"

export default class AbstractProductConfigurator
{
	/**
	 * Create AbstractProductConfigurator.
	 * @param {List<ProductOption>} [productOptions] ProductOptions belonging to the actual product being configurated.
	 */
	constructor(productOptions, product)
	{
		this.productOptions = new KVMap();
		this.product = product;

		if(!(productOptions instanceof List))
			throw new VariableTypeError(PATH, "AbstractProductConfigurator.constructor()", productOptions, "List<ProductOptions>");

		productOptions.foreach(productOption => {this.saveProductOption(productOption)});
	}

	saveProductOption(productOption)
	{
		if(!(productOption instanceof ProductOption))
			throw new VariableTypeError(PATH, "AbstractProductConfigurator.saveProductOption()", productOption, "ProductOption");

		this.productOptions.add(productOption.type.id, productOption);
	}

	selectProductOptionChoice(productOptionTypeId, productOptionVariantId)
	{
		let productOption = this.productOptions.get(productOptionTypeId);
		this.saveProductOptionChoice(new ProductOptionChoice(productOption.type, productOption.variants.get(productOptionVariantId)));
	}

	getValidProductOptionVariants(productOptionId)
	{
		/*
		for(let idx in this.allProductOptions)
			if(this.allProductOptions[idx].id === productOptionId)
				return this.allProductOptions[idx].variants.filter((variant)=>this.optionVariantCanBeSelected(variant));
		*/
	}

	saveProductOptionChoice(productOptionChoice)
	{
		this.product.saveProductOptionChoice(productOptionChoice);
		if(productOptionChoice.productOptionType.title === "Offnungsart")
			this.product.image = productOptionChoice.productOptionVariant.image;
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

	get productOptions()
	{
		return this._productOptions;
	}

	set product(product)
	{
		this._product = product;
	}

	set productOptions(options)
	{
		this._productOptions = options;
	}
}