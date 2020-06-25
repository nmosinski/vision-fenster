const PATH = "public/src/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartRepository.js";

import {v4 as UUID} from "uuid"

import ShoppingCart from "public/src/main/feature/shoppingCart/model/ShoppingCart.js"
import IShoppingCartRepository from "public/src/main/feature/shoppingCart/model/IShoppingCartRepository.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"
import WixDataShoppingCartItemRepository from "public/src/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartItemRepository.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const COLLECTION_NAME = "shopping_cart"
const MAPPING = {"id":"_id", "userId":"userId"};

/**
 * @class
 * A class representing a ShoppingCartRepository in WixData.
 */
class WixDataShoppingCartRepository extends IShoppingCartRepository(WixDataRepository)
{
	/**
	 * Create a WixDataShoppingCartRepsitory.
	 * @param {boolean} authorisation - The authorisation setting for WixDataRepository. True if authorisation should be considered.
	 * @param {boolean} hooks - The hooks setting for WixDataRepository. True if hooks should be considered.
	 */
	constructor(authorisation=true, hooks=true)
	{
        super(COLLECTION_NAME, new KVMap(MAPPING), authorisation, hooks);
        this._wixDataShoppingCartItemRepository = new WixDataShoppingCartItemRepository(authorisation, hooks);
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
	async getShoppingCart(shoppingCartId)
	{
		let shoppingCartObject = await this.get(shoppingCartId);

		if(JsTypes.isUnspecified(shoppingCartObject))
			return;

		let shoppingCartItemsList = this._wixDataShoppingCartItemRepository.getShoppingCartItemsByShoppingCartId(shoppingCartId);

		return new ShoppingCart(shoppingCartObject.id, shoppingCartObject.userId, shoppingCartItemsList);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getShoppingCartByUserId(userId)
	{
		let query = this.query().eq(MAPPING.userId, userId);
		let objects = await this.find(query);
		let shoppingCartObject = objects[0];

		if(JsTypes.isUnspecified(shoppingCartObject))
			return;

		let shoppingCartItemsList = await this._wixDataShoppingCartItemRepository.getShoppingCartItemsByShoppingCartId(shoppingCartObject.id);

		return new ShoppingCart(shoppingCartObject.id, shoppingCartObject.userId, shoppingCartItemsList);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveShoppingCart(shoppingCart)
	{
		await this._wixDataShoppingCartItemRepository.deleteShoppingCartItemsByShoppingCartId(shoppingCart.id);
		if(!shoppingCart.items.isEmpty())
			await this._wixDataShoppingCartItemRepository.saveMultipleShoppingCartItems(shoppingCart.items);
		
		await this.save(shoppingCart);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async updateShoppingCart(shoppingCart)
	{
		await this._wixDataShoppingCartItemRepository.deleteShoppingCartItemsByShoppingCartId(shoppingCart.id);
		if(!shoppingCart.items.isEmpty())
			await this._wixDataShoppingCartItemRepository.saveMultipleShoppingCartItems(shoppingCart.items);
		
		await this.update(shoppingCart);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async deleteShoppingCart(shoppingCartId)
	{
		await this._wixDataShoppingCartItemRepository.deleteShoppingCartItemsByShoppingCartId(shoppingCartId);
		await this.remove(shoppingCartId);
	}
}

export default WixDataShoppingCartRepository;