const PATH = "public/src/main/feature/product/model/AbstractProductConfigurator.js";

import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"
import ProductOption from "public/src/main/feature/product/model/ProductOption.js"

import ClonableKVMap from "public/src/main/common/util/map/ClonableKVMap.js"
import List from "public/src/main/common/util/list/List.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"

export default class AbstractProductConfigurator
{
	/**
	 * Create AbstractProductConfigurator.
	 * @param {ClonableKVMap<ProductOption>} [productOptions] ProductOptions belonging to the actual product being configurated.
	 */
	constructor(productOptions, product)
	{
		this.product = product;

		if(!(productOptions instanceof ClonableKVMap))
			throw new VariableTypeError(PATH, "AbstractProductConfigurator.constructor()", productOptions, "ClonableKVMap<ProductOption>");

		this.productOptions = productOptions;
	}

	saveProductOption(productOption)
	{
		if(!(productOption instanceof ProductOption))
			throw new VariableTypeError(PATH, "AbstractProductConfigurator.saveProductOption()", productOption, "ProductOption");

		this._productOptions.add(productOption.type.id, productOption);
	}

	selectProductOptionChoice(productOptionTypeId, productOptionVariantId)
	{
		let productOption = this._productOptions.get(productOptionTypeId);
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
		this._product.saveProductOptionChoice(productOptionChoice);
		if(productOptionChoice.productOptionType.title === "Offnungsart")
			this._product.image = productOptionChoice.productOptionVariant.image;
		this._product.price = this.calculatePrice();
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
		return this._product.clone();
	}

	get productOptions()
	{
		return this._productOptions.clone();
	}

	set product(product)
	{
		this._product = product.clone();
	}

	set productOptions(options)
	{
		this._productOptions = new ClonableKVMap();
		options.values().foreach(option => {this.saveProductOption(option)});
	}
}