const PATH = "public/src/main/feature/product/model/IProductOptionVariantRepository.js";

const IProductOptionVariantRepository = (superclass) => 

/**
 * @alias IProductOptionVariantRepository
 * @interface
 */
class extends superclass
{
	constructor(...args){super(args);}

	getProductOptionVariant(productOptionVariantId){}

	saveProductOptionVariant(productOptionVariant){}

	updateProductOptionVariant(productOptionVariant){}

	deleteProductOptionVariant(productOptionVariantId){}
}

export default IProductOptionVariantRepository;