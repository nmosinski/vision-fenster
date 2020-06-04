const PATH = "public/src/main/feature/product/model/IProductComplexityRepository.js";

const IProductComplexityRepository = (superclass=null) => 

/**
 * @alias IProductComplexityRepository
 * @interface
 */
class extends superclass
{
	getProductComplexity(productComplexityId){}

	saveProductComplexity(productComplexity){}

	updateProductComplexity(productComplexity){}

	deleteProductComplexity(productComplexityId){}
}

export default IProductComplexityRepository;