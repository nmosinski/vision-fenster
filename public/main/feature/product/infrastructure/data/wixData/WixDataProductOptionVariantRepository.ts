const PATH = "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductOptionVariantRepository.js";

import ProductOptionVariant from "public/src/main/feature/product/model/ProductOptionVariant.js"
import IProductOptionVariantRepository from "public/src/main/feature/product/model/IProductOptionVariantRepository.js"
import KVMap from "../../../../../common/util/collections/map/KVMap.js"
import List from "../../../../../common/util/collections/list/List.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"

import EntityNotFoundError from "public/src/main/feature/product/model/EntityNotFoundError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const VARIANT_COLLECTION_NAME = "product_option_variant"
const IMAGE_COLLECTION_NAME = "product_option_variant_image"
const VARIANT_MAPPING = {"id":"_id", "productOptionTypeId":"productOptionTypeId", "title": "title"};
const IMAGE_MAPPING = {"id":"_id", "productOptionVariantId":"productOptionVariantId", "title": "title", "image": "image"};

/**
 * @class
 * A class representing a wix data product option variant repository.
 */
class WixDataProductOptionVariantRepository extends WixDataRepository implements IProductOptionVariantRepository
{
	private _wixDataImageRepository: WixDataImageRepository;
	/**
	 * Create a WixDataProductOptionVariantRepository.
	 * @param {boolean} [authorisation=true] Authorisation option for wix data db. True if authorisation should be considered.
	 * @param {boolean} [hooks=true] Hooks option for wix data db. True if hooks should be considered.
	 */
	constructor(authorisation: boolean=true, hooks: boolean=true)
	{
        super(VARIANT_COLLECTION_NAME, new KVMap(new Map(Object.entries(VARIANT_MAPPING))), authorisation, hooks);
		this._wixDataImageRepository = new WixDataImageRepository(authorisation, hooks);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductOptionVariant(productOptionVariantId: string): Promise<ProductOptionVariant>
	{
		return this.get(productOptionVariantId).then((v) => {
			if(JsTypes.isUnspecified(v))
				throw new EntityNotFoundError(PATH, "WixDataProductOptionVariantRepository.getProductOptionVariant()", productOptionVariantId);
			return (JsTypes.isUnspecified(v))?null:this._wixDataImageRepository.getImage(productOptionVariantId).then((image) => {
                return new ProductOptionVariant(v.id, v.productOptionTypeId, v.title, image);
			});	
		});
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getProductOptionVariantsByProductOptionTypeId(productOptionTypeId: string): Promise<List<ProductOptionVariant>>
	{
		let query = this.query().eq("productOptionTypeId", productOptionTypeId);
		let objects = await this.find(query);
		if(JsTypes.isEmpty(objects))
			throw new EntityNotFoundError(PATH, "WixDataProductOptionVariantRepository.getProductOptionVariantsByProductOptionTypeId()", productOptionTypeId);
			
		let variants = new List<ProductOptionVariant>();
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
	async getManyProductOptionVariants(productOptionVariantIds: List<string>): Promise<List<ProductOptionVariant>>
	{
		let query = this.query().hasSome(VARIANT_MAPPING.id, productOptionVariantIds.toArray());
		let objects = await this.find(query);
		
		if(JsTypes.isEmpty(objects))
			throw new EntityNotFoundError(PATH, "WixDataProductOptionVariantRepository.getManyProductOptionVariantsByIds()", "productOptionVariantIds");
			
		let variants = new List<ProductOptionVariant>();
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
	async saveProductOptionVariant(productOptionVariant: ProductOptionVariant): Promise<void>
	{
		await this.save(productOptionVariant);
		await this._wixDataImageRepository.saveImage(productOptionVariant);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateProductOptionVariant(productOptionVariant: ProductOptionVariant): Promise<void>
	{
		await this.update(productOptionVariant);
		await this._wixDataImageRepository.updateImage(productOptionVariant);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteProductOptionVariant(productOptionVariantId: string): Promise<void>
	{
		await this.remove(productOptionVariantId);
		await this._wixDataImageRepository.deleteImage(productOptionVariantId);
	}
}

/**
 * @class
 * Inner class representing a wix data repository for image of product option variant.
 */
class WixDataImageRepository extends WixDataRepository
{
	/**
	 * Create a WixDataImageRepository.
	 * @param {boolean} [authorisation=true] Authorisation option for wix data db. True if authorisation should be considered.
	 * @param {boolean} [hooks=true] Hooks option for wix data db. True if hooks should be considered.
	 */
	constructor(authorisation: boolean=true, hooks: boolean=true)
	{
		super(IMAGE_COLLECTION_NAME, new KVMap(new Map(Object.entries(IMAGE_MAPPING))), authorisation, hooks);
	}

	async getImage(productOptionVariantId: string): Promise<string>
	{
		return this.get(productOptionVariantId).then(object=>{return (JsTypes.isUnspecified(object))?null:object.image});
	}

	/**
	 * Save image.
	 * @param {ProductOptionVariant} productOptionVariant The ProductOptionVariant of which the image will be saved.
	 */
	async saveImage(productOptionVariant: ProductOptionVariant): Promise<void>
	{
		await this.save(productOptionVariant.image);
	}
	
	/**
	 * Update image.
	 * @param {ProductOptionVariant} productOptionVariant The ProductOptionVariant of which the image will be updated.
	 */
	async updateImage(productOptionVariant): Promise<void>
	{
		await this.update(productOptionVariant.image);
	}

	/**
	 * Delete image.
	 * @param {ProductOptionVariant} productOptionVariant The ProductOptionVariant of which the image will be deleted.
	 */
	async deleteImage(productOptionVariantId): Promise<void>
	{
		await this.remove(productOptionVariantId);
	}
}

export default WixDataProductOptionVariantRepository
