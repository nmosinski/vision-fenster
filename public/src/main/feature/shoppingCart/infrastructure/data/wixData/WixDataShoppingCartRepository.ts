const PATH = "public/src/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartRepository.js";

import {v4 as UUID} from "uuid"

import ShoppingCart from "public/src/main/feature/shoppingCart/model/ShoppingCart.js"
import IShoppingCartRepository from "public/src/main/feature/shoppingCart/model/IShoppingCartRepository.js"
import WixDataRepository from "public/src/main/common/wixData/WixDataRepository.js"
import WixDataShoppingCartItemRepository from "public/src/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartItemRepository.js"
import KVMap from "../../../../../common/util/collections/map/KVMap.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const COLLECTION_NAME = "shopping_cart"
const MAPPING = {"id":"_id", "userId":"userId"};

/**
 * @class
 * A class representing a ShoppingCartRepository in WixData.
 */
class WixDataShoppingCartRepository extends WixDataRepository implements IShoppingCartRepository
{
	private _wixDataShoppingCartItemRepository: WixDataShoppingCartItemRepository;
	/**
	 * Create a WixDataShoppingCartRepsitory.
	 * @param {boolean} authorisation - The authorisation setting for WixDataRepository. True if authorisation should be considered.
	 * @param {boolean} hooks - The hooks setting for WixDataRepository. True if hooks should be considered.
	 */
	constructor(authorisation=true, hooks=true)
	{
        super(COLLECTION_NAME, new KVMap(new Map(Object.entries(MAPPING))), authorisation, hooks);
        this._wixDataShoppingCartItemRepository = new WixDataShoppingCartItemRepository(authorisation, hooks);
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
	async getShoppingCart(shoppingCartId: string): Promise<ShoppingCart>
	{
		let shoppingCartObject = await this.get(shoppingCartId);

		if(JsTypes.isUnspecified(shoppingCartObject))
			return;

		let shoppingCartItemsList = await this._wixDataShoppingCartItemRepository.getShoppingCartItemsByShoppingCartId(shoppingCartId);

		return new ShoppingCart({ id: { id: shoppingCartObject.id, userId: shoppingCartObject.userId, items: shoppingCartItemsList } });
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async getShoppingCartByUserId(userId: string): Promise<ShoppingCart>
	{
		let query = this.query().eq(MAPPING.userId, userId);
		let objects = await this.find(query);
		let shoppingCartObject = objects[0];

		if(JsTypes.isUnspecified(shoppingCartObject))
			return;

		let shoppingCartItemsList = await this._wixDataShoppingCartItemRepository.getShoppingCartItemsByShoppingCartId(shoppingCartObject.id);

		return new ShoppingCart({ id: { id: shoppingCartObject.id, userId: shoppingCartObject.userId, items: shoppingCartItemsList } });
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	async saveShoppingCart(shoppingCart: ShoppingCart): Promise<void>
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
	async updateShoppingCart(shoppingCart: ShoppingCart): Promise<void>
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
	async deleteShoppingCart(shoppingCartId: string): Promise<void>
	{
		await this._wixDataShoppingCartItemRepository.deleteShoppingCartItemsByShoppingCartId(shoppingCartId);
		await this.remove(shoppingCartId);
	}
}

export default WixDataShoppingCartRepository;