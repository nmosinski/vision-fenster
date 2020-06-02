const PATH = "public/src/main/feature/shoppingCart/application/ShoppingCartApplicationService.js";

export default class ShoppingCartApplicationService
{
	constructor(shoppingCartRepository, shoppingCartItemRepository)
	{
		this.shoppingCartRepository = shoppingCartRepository;
		this.shoppingCartItemRepository = shoppingCartItemRepository;
	}

	set shoppingCartRepository(shoppingCartRepository)
	{
		this._shoppingCartRepository = shoppingCartRepository;
	}

	set shoppingCartItemRepository(shoppingCartItemRepository)
	{
		this._shoppingCartItemRepository = shoppingCartItemRepository;
	}

	get shoppingCartRepository()
	{
		return this._shoppingCartRepository;
	}

	get shoppingCartItemRepository()
	{
		return this._shoppingCartItemRepository;
	}
}