const PATH = "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductRepository.js";

import IProductRepository from "public/src/main/feature/product/model/IProductRepository.js"
import Product from "public/src/main/feature/product/model/Product.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"

import EntityNotFoundError from "public/src/main/feature/product/model/EntityNotFoundError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const COLLECTION_NAME = "product_option_type"
const MAPPING = {"id":"_id", "productModelId":"productModelId", "price": "price", "image":"image"};

class WixDataProductRepository extends IProductRepository(WixDataRepository)
{
	constructor(authorisation=true, hooks=true)
	{
        super(COLLECTION_NAME, new KVMap(MAPPING), authorisation, hooks);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProduct(productId)
	{
		return this.get(productId).then((v) => {
			if(JsTypes.isUnspecified(v))
				throw new EntityNotFoundError(PATH, "WixDataProductRepository.getProduct()", productId);
            return new Product(v.id, v.productOptionModelId, v.price, v.image);	
		});
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
			products.add(new Product(objects[idx].id, objects[idx].productOptionModelId, objects[idx].price, objects[idx].image));

		return products;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveProduct(product)
	{
		await this.save(product);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateProduct(product)
	{
		await this.update(product);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteProduct(productId)
	{
		await this.remove(productId);
	}
}

export default WixDataProductRepository
