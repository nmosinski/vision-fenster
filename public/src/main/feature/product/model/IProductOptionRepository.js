const PATH = "public/src/main/feature/product/model/IProductOptionRepository.js";

const IProductOptionRepository = (superclass=null) => 

/**
 * @alias IProductOptionRepository
 * @interface
 */
class extends superclass
{
	getProductOption(productOptionId){}

	saveProductOption(productOption){}

	updateProductOption(productOption){}

	deleteProductOption(productOptionId){}
}

export default IProductOptionRepository;