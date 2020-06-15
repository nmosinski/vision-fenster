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

class WixDataProductOptionTypeRepository extends IProductOptionTypeRepository(WixDataRepository)
{
	constructor(authorisation=true, hooks=true)
	{
        super(COLLECTION_NAME, new KVMap(MAPPING), authorisation, hooks);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductOptionType(productOptionTypeId)
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
	async getProductOptionTypesByProductModelId(productModelId)
	{
		let query = this.query().eq("productModelId", productModelId);
		let objects = await this.find(query);
		if(JsTypes.isEmpty(objects))
			throw new EntityNotFoundError(PATH, "WixDataProductOptionTypeRepository.getProductOptionTypesByProductModelId()", productModelId);
		
		let variants = new List();
		for(let idx in objects)
			variants.add(new ProductOptionType(objects[idx].id, objects[idx].productModelId, objects[idx].title));

		return variants;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveProductOptionType(productOptionType)
	{
		await this.save(productOptionType);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateProductOptionType(productOptionType)
	{
		await this.update(productOptionType);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteProductOptionType(productOptionTypeId)
	{
		await this.remove(productOptionTypeId);
	}
}

export default WixDataProductOptionTypeRepository
