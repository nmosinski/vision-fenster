import ProductModel from "public/main/feature/product/model/ProductModel.js";

interface IProductModelRepository
{
	/**
	 * @param {string} productModelId
	 * @returns {Promise<ProductModel>}
	 */
	getProductModel(productModelId: string): Promise<ProductModel>;

	/**
	 * @param {ProductModel} productModel 
	 */
	saveProductModel(productModel: ProductModel): Promise<void>;

	/**
	 * @param {ProductModel} productModel 
	 */
	updateProductModel(productModel: ProductModel): Promise<void>;

	/**
	 * @param {string} productModelId
	 */
	deleteProductModel(productModelId: string): Promise<void>;
}

export default IProductModelRepository;