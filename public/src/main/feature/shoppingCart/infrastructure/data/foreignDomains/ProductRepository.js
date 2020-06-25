const PATH = "public/src/main/feature/shoppingCart/infrastructure/data/foreignDomains/ProductRepository.js";

import IProductRepository from "public/src/main/feature/shoppingCart/model/IProductRepository.js"
import WixDataProductRepository from "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductRepository.js"
import Product from "public/src/main/feature/shoppingCart/model/Product.js"
import ProductOption from "public/src/main/feature/shoppingCart/model/ProductOption.js"

import List from "public/src/main/common/util/list/List.js"

class ProductRepository extends IProductRepository()
{
	constructor()
	{
		super();
		this._foreignProductRepo = new WixDataProductRepository();
	}

	async getProduct(id)
	{
		let product = await this._foreignProductRepo.getProduct(id);
		let productOptions = new List();
		product.productOptionChoices.values().foreach(choice => {productOptions.add(new ProductOption(choice.productOptionType.title, choice.productOptionVariant.title));});

		return new Product(product.id, "Fenster", product.price, product.image, productOptions);
	}
}

export default ProductRepository;