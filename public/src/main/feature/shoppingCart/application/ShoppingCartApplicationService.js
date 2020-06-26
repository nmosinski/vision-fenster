const PATH = "public/src/main/feature/shoppingCart/application/ShoppingCartApplicationService.js";

import IAuthenticationService from "public/src/main/feature/shoppingCart/model/IAuthenticationService.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"

import ShoppingCartItem from "public/src/main/feature/shoppingCart/model/ShoppingCartItem.js"
import ShoppingCart from "public/src/main/feature/shoppingCart/model/ShoppingCart.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a shopping cart application service.
 */
class ShoppingCartApplicationService
{
	/**
	 * Create ShoppingCartApplicationService
	 * @param {IShoppingCartRepository} shoppingCartRepository - A ShoppingCartRepository.
	 * @param {IShoppingCartItemRepository} shoppingCartItemRepository - A ShoppingCartItemRepository.
	 * @param {IProductRepository} productRepository - A ProductRepository.
	 * @param {IAuthenticationServiceRepository} authenticationService - An authentication service.
	 */
	constructor(shoppingCartRepository, shoppingCartItemRepository, productRepository, authenticationService)//, shoppingCartValidationService)
	{
		this.shoppingCartRepository = shoppingCartRepository;
		this.shoppingCartItemRepository = shoppingCartItemRepository;
		this.productRepository = productRepository;
		this.authenticationService = authenticationService;
		//this.shoppingCartValidationService = shoppingCartValidationService;
	}

	/**
	 * Creates a shopping cart for the current user if the cart doesnt exist yet.
	 * @return {string} The id of the created cart.
	 */
	async createShoppingCartForCurrentUserIfDoesntExist()
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
	 * @param {number} count - The number of items to be added.
	 */
	async addNewItemToCurrentUsersShoppingCart(productId, count=1)
	{
		let product = await this._productRepository.getProduct(productId);
		let shoppingCart = await this._getCurrentUsersShoppingCart();
		let details = "";
		product.productOptions.foreach(option => {details += option.type + ": " + option.variant + "\n";});
		let item = new ShoppingCartItem(this._shoppingCartItemRepository.nextIdentity(), shoppingCart.id, product.id, product.type, count, product.price, product.image, details);
		shoppingCart.addItem(item);
		await this._shoppingCartRepository.updateShoppingCart(shoppingCart);
	}


	async updateCurrentUsersShoppingCart(newShoppingCart)
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
	 * @return {ShoppingCart} The current users shopping cart.
	 */
	async _getCurrentUsersShoppingCart()
	{
		return await this._shoppingCartRepository.getShoppingCartByUserId(this._authenticationService.getCurrentUsersId());
	}

	/**
	 * Check if current user owns this shopping cart.
	 */
	_currentUserOwnsShoppingCart(shoppingCart)
	{
		return this._authenticationService.isCurrentUsersId(shoppingCart.userId);
	}

	set shoppingCartRepository(shoppingCartRepository)
	{
		this._shoppingCartRepository = shoppingCartRepository;
	}

	set shoppingCartItemRepository(shoppingCartItemRepository)
	{
		this._shoppingCartItemRepository = shoppingCartItemRepository;
	}

	set productRepository(productRepository)
	{
		this._productRepository = productRepository;
	}

	set authenticationService(service)
	{
		if(!(service instanceof IAuthenticationService))
			throw new VariableTypeError(PATH, "ShoppingCartApplicationService.set authenticationService()", service, "IAuthenticationService");

		this._authenticationService = service;
	}

	/*
	set shoppingCartValidationService(service)
	{
		if(!(service instanceof IShoppingCartValidationService))
			throw new VariableTypeError(PATH, "ShoppingCartApplicationService.set shoppingCartValidationService()", service, "IShoppingCartValidationService");

		this._shoppingCartValidationService = service;
	}
	*/

	get shoppingCartRepository()
	{
		return this._shoppingCartRepository;
	}

	get shoppingCartItemRepository()
	{
		return this._shoppingCartItemRepository;
	}

	get productRepository()
	{
		return this._productRepository;
	}

	get authenticationService()
	{
		return this._authenticationService;
	}

	/*
	get shoppingCartValidationService()
	{
		return this._shoppingCartValidationService;
	}
	*/
}

export default ShoppingCartApplicationService;