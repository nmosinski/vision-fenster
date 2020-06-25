const PATH = "public/src/main/feature/shoppingCart/application/ShoppingCartApplicationService.js";

import IAuthenticationService from "public/src/main/feature/shoppingCart/model/IAuthenticationService.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"

import ShoppingCartItem from "public/src/main/feature/shoppingCart/model/ShoppingCartItem.js"
import ShoppingCart from "public/src/main/feature/shoppingCart/model/ShoppingCart.js"

class ShoppingCartApplicationService
{
	constructor(shoppingCartRepository, shoppingCartItemRepository, productRepository, authenticationService)
	{
		this.shoppingCartRepository = shoppingCartRepository;
		this.shoppingCartItemRepository = shoppingCartItemRepository;
		this.productRepository = productRepository;
		this.authenticationService = authenticationService;
	}

	async createShoppingCartForCurrentUser()
	{
		let shoppingCart;
		try
		{
			shoppingCart = await this._getCurrentUsersShoppingCart();
		}
		catch(err)
		{
			shoppingCart = new ShoppingCart(this._shoppingCartRepository.nextIdentity(), this._authenticationService.getCurrentUsersId());	
			await this._shoppingCartRepository.saveShoppingCart(shoppingCart);
		}

		return shoppingCart.id;
	}

	async addNewItemToCurrentsUserShoppingCart(productId, count)
	{
		let product = await this._productRepository.getProduct(productId);
		let shoppingCart = await this._getCurrentUsersShoppingCart();
		let details = "";
		product.productOptions.foreach(option => {details += option.type + ": " + option.variant;});
		let item = new ShoppingCartItem(this._shoppingCartItemRepository.nextIdentity(), shoppingCart.id, product.id, count, product.price, details);

		shoppingCart.addItem(item);
		await this._shoppingCartRepository.updateShoppingCart(shoppingCart);

		return item.id;
	}

	async removeItemFromShoppingCart(shoppingCartItemId)
	{
		await this._shoppingCartItemRepository.deleteShoppingCartItem(shoppingCartItemId);
	}

	async _getCurrentUsersShoppingCart()
	{
		return await this._shoppingCartRepository.getShoppingCartByUserId(this._authenticationService.getCurrentUsersId());
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
}

export default ShoppingCartApplicationService;