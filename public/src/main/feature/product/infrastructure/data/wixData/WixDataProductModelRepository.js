const PATH = "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductModelRepository.js";

import ProductModel from "public/src/main/feature/product/model/ProductModel.js"
import IProductModelRepository from "public/src/main/feature/product/model/IProductModelRepository.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"

import EntityNotFoundError from "public/src/main/feature/product/model/EntityNotFoundError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const COLLECTION_NAME = "product_model"
const MAPPING = {"id":"_id", "productTypeId":"productTypeId", "productCategoryId": "productCategoryId"};

class WixDataProductModelRepository extends IProductModelRepository(WixDataRepository)
{
	constructor(authorisation=true, hooks=true)
	{
        super(COLLECTION_NAME, new KVMap(MAPPING), authorisation, hooks);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductModel(productModelId)
	{
		let object = await this.get(productModelId);
		return new ProductModel(object.id, object.productTypeId, object.productCategoryId);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveProductModel(productModel)
	{
		await this.insert(productModel);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateProductModel(productModel)
	{
		await this.update(productModel);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteProductModel(productModelId)
	{
		await this.remove(productModelId);
	}
}

export default WixDataProductModelRepository;