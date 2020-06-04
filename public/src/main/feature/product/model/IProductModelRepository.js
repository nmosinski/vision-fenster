const PATH = "public/src/main/feature/product/model/IProductModelRepository.js";

const IProductModelRepository = (superclass=null) => 

/**
 * @alias IProductModelRepository
 * @interface
 */
class extends superclass
{
	constructor(...args){super(args);}

	getProductModel(productModelId){}

	saveProductModel(productModel){}

	updateProductModel(productModel){}

	deleteProductModel(productModelId){}
}

export default IProductModelRepository;