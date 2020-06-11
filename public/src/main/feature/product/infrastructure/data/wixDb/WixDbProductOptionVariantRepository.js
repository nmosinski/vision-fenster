const PATH = "public/src/main/feature/product/infrastructure/data/wixDb/WixDbProductOptionVariantRepository.js";

import ProductOptionVariant from "public/src/main/feature/product/model/ProductOptionVariant.js"
import IProductOptionVariantRepository from "public/src/main/feature/product/model/IProductOptionVariantRepository.js"
import ClonableList from "public/src/main/common/util/list/ClonableList.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

let VARIANT_COLLECTION_NAME = "product_option_variant"
let IMAGE_COLLECTION_NAME = "product_option_variant_image"
let VARIANT_MAPPING = {"_id":"_id", "productOptionId":"productOptionId", "title": "title"};
let IMAGE_MAPPING = {"_id":"_id", "productOptionVariantId":"productOptionVariantId", "title": "title", "image": "image"};

class WixDbProductOptionVariantRepository extends IProductOptionVariantRepository(WixDataRepository)
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
                return new ProductOptionVariant(v._id, v.productOptionId, v.title, image);
			});	
		});
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

export default WixDbProductOptionVariantRepository
