const PATH = "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductRepository.js";

import {v4 as UUID} from "uuid"

import WixDataProductOptionTypeRepository from "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductOptionTypeRepository.js"
import WixDataProductOptionVariantRepository from "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductOptionVariantRepository.js"
import IProductRepository from "public/src/main/feature/product/model/IProductRepository.js"
import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"
import Product from "public/src/main/feature/product/model/Product.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"
import KVMap from "../../../../../common/util/collections/map/KVMap.js"
import List from "../../../../../common/util/collections/list/List.js"

import EntityNotFoundError from "public/src/main/feature/product/model/EntityNotFoundError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"
import ProductOptionType from "../../../model/ProductOptionType";
import ProductOptionVariant from "../../../model/ProductOptionVariant";

const PRODUCT_COLLECTION_NAME = "product";
const PRODUCTS_VARIANTS_COLLECTION_NAME = "jt_product_product_option_variant";
const PRODUCT_MAPPING = {"id":"_id", "productModelId":"productModelId", "price": "price", "image":"image"};
const PRODUCTS_VARIANTS_MAPPING = {"_id": "_id", "productOptionVariantId": "productOptionVariantId", "productId":"productId"};

/**
 * @class
 * A class representing a wix data product repository.
 */
class WixDataProductRepository extends WixDataRepository implements IProductRepository
{
	private _wixDataProductOptionChoiceRepository: WixDataProductOptionChoiceRepository;
	/**
	 * Create a WixDataProductRepository.
	 * @param {boolean} [authorisation=true] Authorisation option for wix data db. True if authorisation should be considered.
	 * @param {boolean} [hooks=true] Hooks option for wix data db. True if hooks should be considered.
	 */
	constructor(authorisation: boolean=true, hooks: boolean=true)
	{
        super(PRODUCT_COLLECTION_NAME, new KVMap(new Map(Object.entries(PRODUCT_MAPPING))), authorisation, hooks);
        this._wixDataProductOptionChoiceRepository = new WixDataProductOptionChoiceRepository(authorisation, hooks);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	nextIdentity(): string
	{
		return UUID();
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProduct(productId: string): Promise<Product>
	{
		let object = await this.get(productId);
		if(JsTypes.isUnspecified(object))
			throw new EntityNotFoundError(PATH, "WixDataProductRepository.getProduct()", productId);
		
		let product = new Product(object.id, object.productModelId, object.price, object.image);
		let productOptionChoicesList = await this._wixDataProductOptionChoiceRepository.getProductOptionChoicesOfProductByProductId(product.id);
		
		productOptionChoicesList.foreach(choice=>{product.saveProductOptionChoice(choice);});

		return product;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductsByProductModelId(productModelId: string): Promise<List<Product>>
	{
		let query = this.query().eq("productModelId", productModelId);
		let objects = await this.find(query);
		if(JsTypes.isEmpty(objects))
			throw new EntityNotFoundError(PATH, "WixDataProductRepository.getProductsByProductModelId()", productModelId);
		
		let products = new List<Product>();
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
	async saveProduct(product: Product): Promise<void>
	{
		await this.save(product);
		await this._wixDataProductOptionChoiceRepository.deleteProductOptionChoicesByProductId(product.id);
		await this._wixDataProductOptionChoiceRepository.saveProductOptionChoicesOfProduct(product.id, product.productOptionChoices);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateProduct(product: Product): Promise<void>
	{
		await this.update(product);
		await this._wixDataProductOptionChoiceRepository.deleteProductOptionChoicesByProductId(product.id);
		await this._wixDataProductOptionChoiceRepository.saveProductOptionChoicesOfProduct(product.id, product.productOptionChoices);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteProduct(productId: string): Promise<void>
	{
		await this._wixDataProductOptionChoiceRepository.deleteProductOptionChoicesByProductId(productId);
		await this.remove(productId);
	}
}

/**
 * @class
 * A class representing a WixDataProductOptionChoiceRepository.
 */
class WixDataProductOptionChoiceRepository extends WixDataRepository
{
	private _wixDataProductOptionTypeRepository: WixDataProductOptionTypeRepository;
	private _wixDataProductOptionVariantRepository: WixDataProductOptionVariantRepository;
	/**
	 * Create a WixDataProductOptionChoiceRepository.
	 * @param {boolean} [authorisation=true] Authorisation option for wix data db. True if authorisation should be considered.
	 * @param {boolean} [hooks=true] Hooks option for wix data db. True if hooks should be considered.
	 */
	constructor(authorisation: boolean=true, hooks: boolean=true)
	{
		super(PRODUCTS_VARIANTS_COLLECTION_NAME, new KVMap(new Map(Object.entries(PRODUCTS_VARIANTS_MAPPING))), authorisation, hooks);
		this._wixDataProductOptionTypeRepository = new WixDataProductOptionTypeRepository(authorisation, hooks);
		this._wixDataProductOptionVariantRepository = new WixDataProductOptionVariantRepository(authorisation, hooks);
	}

	/**
	 * Get ProductOptionChoices by product id.
	 * @param {string} productId: The product id.
	 * @returns {Promise<List<ProductOptionChoice>>} The ProductOptionChoices. 
	 */
	async getProductOptionChoicesOfProductByProductId(productId: string): Promise<List<ProductOptionChoice>>
	{
		let query = this.query().eq("productId", productId);
		let objects = await this.find(query);

		let productOptionVariantIds = new List<string>();
		for(let idx in objects)
			productOptionVariantIds.add(objects[idx].productOptionVariantId);
		let productOptionVariants = await this._wixDataProductOptionVariantRepository.getManyProductOptionVariants(productOptionVariantIds);
		
		let productOptionTypeIds = new List<string>();
		productOptionVariants.foreach(variant => {productOptionTypeIds.add(variant.productOptionTypeId);});
		let productOptionTypes = await this._wixDataProductOptionTypeRepository.getManyProductOptionTypes(productOptionTypeIds);
		let productOptionTypesMap = new KVMap<string, ProductOptionType>();
		productOptionTypes.foreach((type: ProductOptionType) => {productOptionTypesMap.add(type.id, type);});

		let productOptionChoices = new List<ProductOptionChoice>();
		productOptionVariants.foreach((variant: ProductOptionVariant) => {productOptionChoices.add(new ProductOptionChoice(productOptionTypesMap.get(variant.productOptionTypeId), variant))});

		return productOptionChoices;
	}

	/**
	 * Save ProductOptionChoices of Product.
	 * @param {string} productId The products id.
	 * @param {KVMap<string, ProductOptionChoice>} productOptionChoices The ProductOptionChoices.
	 */
	async saveProductOptionChoicesOfProduct(productId: string, productOptionChoices: KVMap<string, ProductOptionChoice>): Promise<void>
	{	
		let toSave = new List<object>();
		productOptionChoices.values().foreach((choice: ProductOptionChoice) => {toSave.add({"productId": productId, "productOptionVariantId": choice.productOptionVariant.id});});
		await this.saveMany(toSave);
	}

	/**
	 * Delete all ProductOptionChoices of a product.
	 * @param {string} productId The id of the product.
	 */
	async deleteProductOptionChoicesByProductId(productId: string): Promise<void>
	{
		let query = this.query().eq("productId", productId);
		let objects = await this.find(query);

		let toRemove = new List<string>();
		for(let idx in objects)
			toRemove.add(objects[idx]._id);
		
		if(toRemove.length !== 0)
			await this.removeMany(toRemove);
	}
}

export default WixDataProductRepository
