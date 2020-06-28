const PATH = "public/src/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartItemRepository.js";

import {v4 as UUID} from "uuid"

import ShoppingCartItem from "public/src/main/feature/shoppingCart/model/ShoppingCartItem.js"
import IShoppingCartItemRepository from "public/src/main/feature/shoppingCart/model/IShoppingCartItemRepository.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"

const COLLECTION_NAME = "shopping_cart_item"
const MAPPING = {"id":"_id", "shoppingCartId":"shoppingCartId", "productId":"productId", "title":"title", "count":"count", "singlePrice":"singlePrice", "image":"image", "details":"details"};

/**
 * @class
 * A class representing a ShoppingCartItemRepository in WixData.
 */
class WixDataShoppingCartItemRepository extends WixDataRepository implements IShoppingCartItemRepository
{
	/**
	 * Create a WixDataShoppingCartItemRepsitory.
	 * @param {boolean} authorisation - The authorisation setting for WixDataRepository. True if authorisation should be considered.
	 * @param {boolean} hooks - The hooks setting for WixDataRepository. True if hooks should be considered.
	 */
	constructor(authorisation=true, hooks=true)
	{
        super(COLLECTION_NAME, new KVMap(new Map(Object.entries(MAPPING))), authorisation, hooks);
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
	async getShoppingCartItem(shoppingCartItemId: string): Promise<ShoppingCartItem>
	{
		let object = await this.get(shoppingCartItemId);

		return new ShoppingCartItem(object.id, object.shoppingCartId, object.productId, object.title, object.count, object.singlePrice, object.image, object.details);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getShoppingCartItemsByShoppingCartId(shoppingCartId: string): Promise<List<ShoppingCartItem>>
	{
		let query = this.query().eq(MAPPING.shoppingCartId, shoppingCartId);
		let objects = await this.find(query);
		let items = new List<ShoppingCartItem>();

		for(let idx in objects)
			items.add(new ShoppingCartItem(objects[idx].id, objects[idx].shoppingCartId, objects[idx].productId, objects[idx].title, objects[idx].count, objects[idx].singlePrice, objects[idx].image, objects[idx].details));

		return items;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveShoppingCartItem(shoppingCartItem: ShoppingCartItem): Promise<void>
	{
		await this.save(shoppingCartItem);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveMultipleShoppingCartItems(shoppingCartItems: List<ShoppingCartItem>): Promise<void>
	{
		await this.saveMany(shoppingCartItems);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateShoppingCartItem(shoppingCartItem: ShoppingCartItem): Promise<void>
	{
		await this.update(shoppingCartItem);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateMultipleShoppingCartItems(shoppingCartItems: List<ShoppingCartItem>): Promise<void>
	{
		await this.updateMany(shoppingCartItems);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteShoppingCartItem(shoppingCartItemId: string): Promise<void>
	{
		await this.remove(shoppingCartItemId);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteShoppingCartItemsByShoppingCartId(shoppingCartId: string): Promise<void>
	{
		let query = this.query().eq(MAPPING.shoppingCartId, shoppingCartId);
		let objects = await this.find(query);
		let ids = new List<string>();

		for(let idx in objects)
			ids.add(objects[idx].id);

		if(ids.length > 0)
			await this.removeMany(ids);
	}
}

export default WixDataShoppingCartItemRepository;