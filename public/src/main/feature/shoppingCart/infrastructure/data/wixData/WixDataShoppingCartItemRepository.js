const PATH = "public/src/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartItemRepository.js";

import {v4 as UUID} from "uuid"

import ShoppingCartItem from "public/src/main/feature/shoppingCart/model/ShoppingCartItem.js"
import IShoppingCartItemRepository from "public/src/main/feature/shoppingCart/model/IShoppingCartItemRepository.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const COLLECTION_NAME = "shopping_cart_item"
const MAPPING = {"id":"_id", "shoppingCartId":"shoppingCartId", "productId":"productId", "count":"count", "price":"price", "details":"details"};

/**
 * @class
 * A class representing a ShoppingCartItemRepository in WixData.
 */
class WixDataShoppingCartItemRepository extends IShoppingCartItemRepository(WixDataRepository)
{
	/**
	 * Create a WixDataShoppingCartItemRepsitory.
	 * @param {boolean} authorisation - The authorisation setting for WixDataRepository. True if authorisation should be considered.
	 * @param {boolean} hooks - The hooks setting for WixDataRepository. True if hooks should be considered.
	 */
	constructor(authorisation=true, hooks=true)
	{
        super(COLLECTION_NAME, new KVMap(MAPPING), authorisation, hooks);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	nextIdentity()
	{
		return UUID();
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getShoppingCartItem(shoppingCartItemId)
	{
		let item = await this.get(shoppingCartItemId);

		return new ShoppingCartItem(item.id, item.shoppingCartId, item.productId, item.count, item.singlePrice, item.details);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getShoppingCartItemsByShoppingCartId(shoppingCartId)
	{
		let query = this.query().eq(MAPPING.shoppingCartId, shoppingCartId);
		let objects = await this.find(query);
		let items = new List();

		for(let idx in objects)
			items.add(new ShoppingCartItem(objects[idx].id, objects[idx].shoppingCartId, objects[idx].productId, objects[idx].count, objects[idx].singlePrice, objects[idx].details));

		return items;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveShoppingCartItem(shoppingCartItem)
	{
		await this.save(shoppingCartItem);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveMultipleShoppingCartItems(shoppingCartItems)
	{
		await this.saveMany(shoppingCartItems);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateShoppingCartItem(shoppingCartItem)
	{
		await this.update(shoppingCartItem);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateMultipleShoppingCartItems(shoppingCartItems)
	{
		await this.updateMany(shoppingCartItems);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteShoppingCartItem(shoppingCartItemId)
	{
		await this.remove(shoppingCartItemId);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteShoppingCartItemsByShoppingCartId(shoppingCartId)
	{
		let query = this.query().eq(MAPPING.shoppingCartId, shoppingCartId);
		let objects = await this.find(query);
		let ids = new List();

		for(let idx in objects)
			ids.add(objects[idx].id);

		if(ids.length > 0)
			await this.removeMany(ids);
	}
}

export default WixDataShoppingCartItemRepository;