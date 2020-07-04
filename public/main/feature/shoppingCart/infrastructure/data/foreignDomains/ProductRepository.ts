const PATH = "public/main/feature/shoppingCart/infrastructure/data/foreignDomains/ProductRepository.js";

import IProductRepository from "public/main/feature/shoppingCart/model/IProductRepository.js"
import WixDataProductRepository from "public/main/feature/product/infrastructure/data/wixData/WixDataProductRepository.js"
import Product from "public/main/feature/shoppingCart/model/Product.js"
import ProductOption from "public/main/feature/shoppingCart/model/ProductOption.js"

import List from "../../../../../common/util/collections/list/List.js"

/**
 * @class
 * Class representing a product repository.
 */
class ProductRepository implements IProductRepository
{
	_foreignProductRepo: WixDataProductRepository;
	/**
	 * Create ProductRepository.
	 */
	constructor()
	{
		this._foreignProductRepo = new WixDataProductRepository();
	}

	/**
	 * @override
	 * @inheritDoc 
	 */
	async getProduct(id: string): Promise<Product>
	{
		let product = await this._foreignProductRepo.getProduct(id);
		let productOptions = new List<ProductOption>();
		product.productOptionChoices.values().foreach(choice => {productOptions.add(new ProductOption(choice.productOptionType.title, choice.productOptionVariant.title));});

		return new Product(product.id, "Fenster", product.price, product.image, productOptions);
	}
}

export default ProductRepository;