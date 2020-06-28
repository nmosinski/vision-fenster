const PATH = "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductOptionTypeRepository.js";

import ProductOptionType from "public/src/main/feature/product/model/ProductOptionType.js"
import IProductOptionTypeRepository from "public/src/main/feature/product/model/IProductOptionTypeRepository.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"

import EntityNotFoundError from "public/src/main/feature/product/model/EntityNotFoundError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const COLLECTION_NAME = "product_option_type"
const MAPPING = {"id":"_id", "productModelId":"productModelId", "title": "title"};

/**
 * @class
 * A class representing a wix data product option type repository.
 */
class WixDataProductOptionTypeRepository extends WixDataRepository implements IProductOptionTypeRepository
{
	/**
	 * Create WixDataProductOptionTypeRepository.
	 * @param {boolean} [authorisation=true] Authorisation option for wix data db. True if authorisation should be considered.
	 * @param {boolean} [hooks=true] Hooks option for wix data db. True if hooks should be considered.
	 */
	constructor(authorisation=true, hooks=true)
	{
        super(COLLECTION_NAME, new KVMap(new Map(Object.entries(MAPPING))), authorisation, hooks);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductOptionType(productOptionTypeId: string): Promise<ProductOptionType>
	{
		return this.get(productOptionTypeId).then((v) => {
			if(JsTypes.isUnspecified(v))
				throw new EntityNotFoundError(PATH, "WixDataProductOptionTypeRepository.getProductOptionType()", productOptionTypeId);
            return new ProductOptionType(v.id, v.productOptionModelId, v.title);	
		});
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductOptionTypesByProductModelId(productModelId: string): Promise<List<ProductOptionType>>
	{
		let query = this.query().eq("productModelId", productModelId);
		let objects = await this.find(query);
		if(JsTypes.isEmpty(objects))
			throw new EntityNotFoundError(PATH, "WixDataProductOptionTypeRepository.getProductOptionTypesByProductModelId()", productModelId);
		
		let types = new List<ProductOptionType>();
		for(let idx in objects)
			types.add(new ProductOptionType(objects[idx].id, objects[idx].productModelId, objects[idx].title));

		return types;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getManyProductOptionTypes(productOptionTypeIds: List<string>): Promise<List<ProductOptionType>>
	{
		let query = this.query().hasSome(MAPPING.id, productOptionTypeIds.toArray());
		let objects = await this.find(query);
		
		if(JsTypes.isEmpty(objects))
			throw new EntityNotFoundError(PATH, "WixDataProductOptionTypeRepository.getManyProductOptionTypesByIds()", "productOptionTypeIds");
			
		let types = new List<ProductOptionType>();
		for(let idx in objects)
			types.add(new ProductOptionType(objects[idx].id, objects[idx].productModelId, objects[idx].title));

		return types;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveProductOptionType(productOptionType: ProductOptionType): Promise<void>
	{
		await this.save(productOptionType);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateProductOptionType(productOptionType: ProductOptionType): Promise<void>
	{
		await this.update(productOptionType);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteProductOptionType(productOptionTypeId: string): Promise<void>
	{
		await this.remove(productOptionTypeId);
	}
}

export default WixDataProductOptionTypeRepository
