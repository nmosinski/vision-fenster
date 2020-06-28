const PATH = "public/src/main/feature/shoppingCart/application/ShoppingCartApplicationService.js";

import IAuthenticationService from "public/src/main/feature/shoppingCart/model/IAuthenticationService.js"

import ShoppingCartItem from "public/src/main/feature/shoppingCart/model/ShoppingCartItem.js"
import ShoppingCart from "public/src/main/feature/shoppingCart/model/ShoppingCart.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"
import IShoppingCartItemRepository from "public/src/main/feature/shoppingCart/model/IShoppingCartItemRepository.js"
import IShoppingCartRepository from "public/src/main/feature/shoppingCart/model/IShoppingCartRepository.js"
import IProductRepository from "public/src/main/feature/shoppingCart/model/IProductRepository.js"

/**
 * @class
 * Class representing a shopping cart application service.
 */
class ShoppingCartApplicationService
{
	private _authenticationService: IAuthenticationService;
	private _shoppingCartRepository: IShoppingCartRepository;
	private _shoppingCartItemRepository: IShoppingCartItemRepository;
	private _productRepository: IProductRepository;
	/**
	 * Create ShoppingCartApplicationService
	 * @param {IShoppingCartRepository} shoppingCartRepository - A ShoppingCartRepository.
	 * @param {IShoppingCartItemRepository} shoppingCartItemRepository - A ShoppingCartItemRepository.
	 * @param {IProductRepository} productRepository - A ProductRepository.
	 * @param {IAuthenticationService} authenticationService - An authentication service.
	 */
	constructor(shoppingCartRepository: IShoppingCartRepository, shoppingCartItemRepository: IShoppingCartItemRepository, productRepository: IProductRepository, authenticationService: IAuthenticationService)
	{
		this.shoppingCartRepository = shoppingCartRepository;
		this.shoppingCartItemRepository = shoppingCartItemRepository;
		this.productRepository = productRepository;
		this.authenticationService = authenticationService;
		//this.shoppingCartValidationService = shoppingCartValidationService;
	}

	/**
	 * Creates a shopping cart for the current user if the cart doesnt exist yet.
	 * @return {Promise<string>} The id of the created cart.
	 */
	async createShoppingCartForCurrentUserIfDoesntExist(): Promise<string>
	{
		let shoppingCart = await this._getCurrentUsersShoppingCart();
		
		if(JsTypes.isUnspecified(shoppingCart) || JsTypes.isEmpty(shoppingCart))
		{
			shoppingCart = new ShoppingCart(this._shoppingCartRepository.nextIdentity(), this._authenticationService.getCurrentUsersId());	
			await this._shoppingCartRepository.saveShoppingCart(shoppingCart);
		}
		return shoppingCart.id;		
	}

	/**
	 * Add a new item to the current users shopping cart.
	 * @param {string} productId - The id of the product the shopping cart item refers to.
	 * @param {number} [count=1] - The number of items to be added.
	 */
	async addNewItemToCurrentUsersShoppingCart(productId: string, count: number=1): Promise<void>
	{
		let product = await this._productRepository.getProduct(productId);
		let shoppingCart = await this._getCurrentUsersShoppingCart();
		let details = "";
		product.productOptions.foreach(option => {details += option.type + ": " + option.variant + "\n";});
		let item = new ShoppingCartItem(this._shoppingCartItemRepository.nextIdentity(), shoppingCart.id, product.id, product.type, count, product.price, product.image, details);
		shoppingCart.addItem(item);
		await this._shoppingCartRepository.updateShoppingCart(shoppingCart);
	}

	/**
	 * @param {ShoppingCart} newShoppingCart
	 */
	async updateCurrentUsersShoppingCart(newShoppingCart: ShoppingCart): Promise<void>
	{
		let shoppingCart = await this._shoppingCartRepository.getShoppingCart(newShoppingCart.id);

		shoppingCart.items.foreach((item)=>{
			let newItem = newShoppingCart.getItem(item.id);
			if(!JsTypes.isUnspecified(newItem))
			{
				if(item.count !== newItem.count)
					shoppingCart.setCountOfItem(item.id, newItem.count);
			}
			else
				shoppingCart.removeItem(item.id);
		});
		console.log(shoppingCart);
		await this._shoppingCartRepository.updateShoppingCart(shoppingCart);
	}
	

	/**
	 * Get current users shopping cart.
	 * @return {Promise<ShoppingCart>} The current users shopping cart.
	 */
	async _getCurrentUsersShoppingCart(): Promise<ShoppingCart>
	{
		return await this._shoppingCartRepository.getShoppingCartByUserId(this._authenticationService.getCurrentUsersId());
	}

	/**
	 * Check if current user owns this shopping cart.
	 * @param  {ShoppingCart} shoppingCart
	 * @return {boolean} True if current user owns this shopping cart.
	 */
	_currentUserOwnsShoppingCart(shoppingCart: ShoppingCart): boolean
	{
		return this._authenticationService.isCurrentUsersId(shoppingCart.userId);
	}

	/**
	 * @param {IShoppingCartRepository} shoppingCartRepository
	 */
	set shoppingCartRepository(shoppingCartRepository: IShoppingCartRepository)
	{
		this._shoppingCartRepository = shoppingCartRepository;
	}

	/**
	 * @param {IShoppingCartItemRepository} shoppingCartItemRepository
	 */
	set shoppingCartItemRepository(shoppingCartItemRepository: IShoppingCartItemRepository)
	{
		this._shoppingCartItemRepository = shoppingCartItemRepository;
	}

	/**
	 * @param {IProductRepository} productRepository
	 */
	set productRepository(productRepository: IProductRepository)
	{
		this._productRepository = productRepository;
	}

	/**
	 * @param {IAuthenticationService} service
	 */
	set authenticationService(service: IAuthenticationService)
	{
		this._authenticationService = service;
	}

	/**
	 * @returns {IShoppingCartRepository}
	 */
	get shoppingCartRepository(): IShoppingCartRepository
	{
		return this._shoppingCartRepository;
	}

	/**
	 * @returns {IShoppingCartItemRepository}
	 */
	get shoppingCartItemRepository(): IShoppingCartItemRepository
	{
		return this._shoppingCartItemRepository;
	}
	/**
	 * @returns {IProductRepository}
	 */
	get productRepository(): IProductRepository
	{
		return this._productRepository;
	}

	/**
	 * @returns {IAuthenticationService}
	 */
	get authenticationService(): IAuthenticationService
	{
		return this._authenticationService;
	}
}

export default ShoppingCartApplicationService;