const PATH = "public/main/feature/product/infrastructure/data/wixData/WixDataProductModelRepository.js";

import ProductModel from "public/main/feature/product/model/ProductModel.js"
import IProductModelRepository from "public/main/feature/product/model/IProductModelRepository.js"
import WixDataRepository from "public/main/common/wixData/WixDataRepository.js"
import KVMap from "../../../../../common/util/collections/map/KVMap.js"

import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"

const COLLECTION_NAME = "product_model";
const MAPPING = {"id":"_id", "productTypeId":"productTypeId", "productCategoryId": "productCategoryId"};

/**
 * @class
 * A class representing a wix data product model repository.
 */
class WixDataProductModelRepository extends WixDataRepository implements IProductModelRepository
{
	/**
	 * Create WixDataProductModelRepository.
	 * @param {boolean} [authorisation=true] Authorisation option for wix data db. True if authorisation should be considered.
	 * @param {boolean} [hooks=true] Hooks option for wix data db. True if hooks should be considered.
	 */
	constructor(authorisation: boolean=true, hooks: boolean=true)
	{
        super(COLLECTION_NAME, new KVMap(new Map(Object.entries(MAPPING))), authorisation, hooks);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductModel(productModelId: string): Promise<ProductModel>
	{
		let object = await this.get(productModelId);
		return new ProductModel(object.id, object.productTypeId, object.productCategoryId);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveProductModel(productModel: ProductModel): Promise<void>
	{
		await this.insert(productModel);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateProductModel(productModel: ProductModel): Promise<void>
	{
		await this.update(productModel);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteProductModel(productModelId: string): Promise<void>
	{
		await this.remove(productModelId);
	}
}

export default WixDataProductModelRepository;