const PATH = "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductOptionVariantRepository.js";

import ProductOptionVariant from "public/src/main/feature/product/model/ProductOptionVariant.js"
import IProductOptionVariantRepository from "public/src/main/feature/product/model/IProductOptionVariantRepository.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

let VARIANT_COLLECTION_NAME = "product_option_variant"
let IMAGE_COLLECTION_NAME = "product_option_variant_image"
let VARIANT_MAPPING = {"id":"_id", "productOptionTypeId":"productOptionTypeId", "title": "title"};
let IMAGE_MAPPING = {"id":"_id", "productOptionVariantId":"productOptionVariantId", "title": "title", "image": "image"};

class WixDataProductOptionVariantRepository extends IProductOptionVariantRepository(WixDataRepository)
{
	constructor(authorisation=true, hooks=true)
	{
        super(VARIANT_COLLECTION_NAME, new KVMap(VARIANT_MAPPING), authorisation, hooks);
		this._wixDataImageRepository = new WixDataImageRepository(authorisation, hooks);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductOptionVariant(productOptionVariantId)
	{
		return this.get(productOptionVariantId).then((v) => {
			return (JsTypes.isEmpty(v))?null:this._wixDataImageRepository.getImage(productOptionVariantId).then((image) => {
                return new ProductOptionVariant(v.id, v.productOptionId, v.title, image);
			});	
		});
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductOptionVariantsByProductOptionTypeId(productOptionTypeId)
	{
		let query = this.query().eq("productOptionTypeId", productOptionTypeId);
		let objects = await this.find(query);
		if(JsTypes.isEmpty(objects))
			return null;
			
		let variants = new List();
		for(let idx in objects)
			variants.add(new ProductOptionVariant(objects[idx].id, objects[idx].productOptionTypeId, objects[idx].title));

		let tmpVariantArr = variants.toArray();
		for(let idx in tmpVariantArr)
		{
			let image = await this._wixDataImageRepository.getImage(tmpVariantArr[idx].id);
			tmpVariantArr[idx].image = image;
		}
		return variants;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveProductOptionVariant(productOptionVariant)
	{
		await this.insert(productOptionVariant);
		await this._wixDataImageRepository.saveImage(productOptionVariant);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateProductOptionVariant(productOptionVariant)
	{
		await this.update(productOptionVariant);
		await this._wixDataImageRepository.updateImage(productOptionVariant);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteProductOptionVariant(productOptionVariantId)
	{
		await this.remove(productOptionVariantId);
		await this._wixDataImageRepository.deleteImage(productOptionVariantId);
	}
}

class WixDataImageRepository extends WixDataRepository
{
	constructor(authorisation=true, hooks=true)
	{
		super(IMAGE_COLLECTION_NAME, new KVMap(IMAGE_MAPPING), authorisation, hooks);
	}

	async getImage(productOptionVariantId)
	{
		return this.get(productOptionVariantId).then(object=>{return (JsTypes.isEmpty(object))?null:object.image});
	}

	async saveImage(productOptionVariant)
	{
		await this.insert(productOptionVariant);
	}
	
	async updateImage(productOptionVariant)
	{
		await this.update(productOptionVariant);
	}

	async deleteImage(productOptionVariantId)
	{
		await this.remove(productOptionVariantId);
	}
}

export default WixDataProductOptionVariantRepository
