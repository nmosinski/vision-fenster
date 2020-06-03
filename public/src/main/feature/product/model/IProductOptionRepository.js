const PATH = "public/src/main/feature/product/model/IProductOptionRepository.js";

const IProductOptionRepository = (superclass) => 

/**
 * @alias IProductOptionRepository
 * @interface
 */
class extends superclass
{
	constructor(...args){super(args);}

	getProductOption(productOptionId){}

	saveProductOption(productOption){}

	updateProductOption(productOption){}

	deleteProductOption(productOptionId){}
}

export default IProductOptionRepository;