const PATH = "public/src/main/feature/product/model/IProductRepository.js";

const IProductRepository = (superclass=null) => 

/**
 * @alias IProductRepository
 * @interface
 */
class extends superclass
{
	constructor(...args){super(args);}

	getProduct(productId){}

	saveProduct(product){}

	updateProduct(product){}

	deleteProduct(productId){}

	getNextEntity(){}

}

export default IProductRepository;