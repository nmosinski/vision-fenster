const PATH = "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductRepository.js";

import {v4 as UUID} from "uuid"

import WixDataProductOptionTypeRepository from "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductOptionTypeRepository.js"
import WixDataProductOptionVariantRepository from "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductOptionVariantRepository.js"
import IProductRepository from "public/src/main/feature/product/model/IProductRepository.js"
import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"
import Product from "public/src/main/feature/product/model/Product.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"

import EntityNotFoundError from "public/src/main/feature/product/model/EntityNotFoundError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const PRODUCT_COLLECTION_NAME = "product";
const PRODUCTS_VARIANTS_COLLECTION_NAME = "jt_product_product_option_variant";
const PRODUCT_MAPPING = {"id":"_id", "productModelId":"productModelId", "price": "price", "image":"image"};
const PRODUCTS_VARIANTS_MAPPING = {"_id": "_id", "productOptionVariantId": "productOptionVariantId", "productId":"productId"};

class WixDataProductRepository extends IProductRepository(WixDataRepository)
{
	constructor(authorisation=true, hooks=true)
	{
        super(PRODUCT_COLLECTION_NAME, new KVMap(PRODUCT_MAPPING), authorisation, hooks);
        this._wixDataProductOptionChoiceRepository = new WixDataProductOptionChoiceRepository(authorisation, hooks);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	nextIdentity()
	{
		return UUID();
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProduct(productId)
	{
		let object = await this.get(productId);
		if(JsTypes.isUnspecified(object))
			throw new EntityNotFoundError(PATH, "WixDataProductRepository.getProduct()", productId);
		
		console.log(object);
		let product = new Product(object.id, object.productModelId, object.price, object.image);
		let productOptionChoicesList = await this._wixDataProductOptionChoiceRepository.getProductOptionChoicesOfProductByProductId(product.id);
		
		productOptionChoicesList.foreach(choice=>{product.saveProductOptionChoice(choice);});

		return product;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductsByProductModelId(productModelId)
	{
		let query = this.query().eq("productModelId", productModelId);
		let objects = await this.find(query);
		if(JsTypes.isEmpty(objects))
			throw new EntityNotFoundError(PATH, "WixDataProductRepository.getProductsByProductModelId()", productModelId);
		
		let products = new List();
		for(let idx in objects)
		{
			let product = new Product(objects[idx].id, objects[idx].productOptionModelId, objects[idx].price, objects[idx].image);
			let productOptionChoicesList = await this._wixDataProductOptionChoiceRepository.getProductOptionChoicesOfProductByProductId(product.id);
			productOptionChoicesList.foreach(choice => {product.saveProductOptionChoice(choice);});
			products.add(product);
		}

		return products;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveProduct(product)
	{
		await this.save(product);
		await this._wixDataProductOptionChoiceRepository.deleteProductOptionChoicesByProductId(product.id);
		await this._wixDataProductOptionChoiceRepository.saveProductOptionChoicesOfProduct(product.id, product.productOptionChoices);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateProduct(product)
	{
		await this.update(product);
		await this._wixDataProductOptionChoiceRepository.deleteProductOptionChoicesByProductId(product.id);
		await this._wixDataProductOptionChoiceRepository.saveProductOptionChoicesOfProduct(product.id, product.productOptionChoices);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteProduct(productId)
	{
		await this._wixDataProductOptionChoiceRepository.deleteProductOptionChoicesByProductId(productId);
		await this.remove(productId);
	}
}

class WixDataProductOptionChoiceRepository extends WixDataRepository
{
	constructor(authorisation=true, hooks=true)
	{
		super(PRODUCTS_VARIANTS_COLLECTION_NAME, new KVMap(PRODUCTS_VARIANTS_MAPPING), authorisation, hooks);
		this._wixDataProductOptionTypeRepository = new WixDataProductOptionTypeRepository(authorisation, hooks);
		this._wixDataProductOptionVariantRepository = new WixDataProductOptionVariantRepository(authorisation, hooks);
	}

	async getProductOptionChoicesOfProductByProductId(productId)
	{
		let query = this.query().eq("productId", productId);
		let objects = await this.find(query);

		let productOptionVariantIds = new List();
		for(let idx in objects)
			productOptionVariantIds.add(objects[idx].productOptionVariantId);
		let productOptionVariants = await this._wixDataProductOptionVariantRepository.getManyProductOptionVariants(productOptionVariantIds);
		
		let productOptionTypeIds = new List();
		productOptionVariants.foreach(variant => {productOptionTypeIds.add(variant.productOptionTypeId);});
		let productOptionTypes = await this._wixDataProductOptionTypeRepository.getManyProductOptionTypes(productOptionTypeIds);
		let productOptionTypesMap = new KVMap();
		productOptionTypes.foreach(type => {productOptionTypesMap.add(type.id, type);});

		let productOptionChoices = new List();
		productOptionVariants.foreach(variant => {productOptionChoices.add(new ProductOptionChoice(productOptionTypesMap.get(variant.productOptionTypeId), variant))});

		return productOptionChoices;
	}

	async saveProductOptionChoicesOfProduct(productId, productOptionChoices)
	{	
		let toSave = new List();
		productOptionChoices.values().foreach(choice => {toSave.add({"productId": productId, "productOptionVariantId": choice.productOptionVariant.id});});
		await this.saveMany(toSave);
	}

	async deleteProductOptionChoicesByProductId(productId)
	{
		let query = this.query().eq("productId", productId);
		let objects = await this.find(query);

		let toRemove = new List();
		for(let idx in objects)
			toRemove.add(objects[idx]._id);
		
		if(toRemove.length !== 0)
			await this.removeMany(toRemove);
	}
}

export default WixDataProductRepository
