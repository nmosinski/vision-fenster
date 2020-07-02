const PATH = "public/src/main/feature/product/application/ProductApplicationService.js";

import CreateUserProductCommand from "public/src/main/feature/product/application/CreateUserProductCommand.js";
import UpdateProductCommand from "public/src/main/feature/product/application/UpdateProductCommand.js";
import DeleteProductCommand from "public/src/main/feature/product/application/DeleteProductCommand.js";
import Product from "public/src/main/feature/product/model/Product.js";
import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js";
import ProductOptionType from "public/src/main/feature/product/model/ProductOptionType.js";
import IProductRepository from "public/src/main/feature/product/model/IProductRepository.js";
import IProductModelRepository from "public/src/main/feature/product/model/IProductModelRepository.js";
import IProductOptionTypeRepository from "public/src/main/feature/product/model/IProductOptionTypeRepository.js";
import IProductOptionVariantRepository from "public/src/main/feature/product/model/IProductOptionVariantRepository.js";

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"

import List from "../../../common/util/collections/list/List.js"
import KVMap from "../../../common/util/collections/map/KVMap.js"
import ProductOptionVariant from "../model/ProductOptionVariant";

/**
 * @class
 * Class representing the application service of product domain.
 */
class ProductApplicationService
{
	private _productRepository: IProductRepository;
	private _productModelRepository: IProductModelRepository;
	private _productOptionTypeRepository: IProductOptionTypeRepository;
	private _productOptionVariantRepository: IProductOptionVariantRepository;
	/**
	 * Create a ProductApplicationService.
	 * @param {IProductRepository} productRepository - A product repository.
	 * @param {IProductModelRepository} productModelRepository - A product model repository.
	 * @param {IProductOptionTypeRepository} productOptionTypeRepository - A product option type repository.
	 * @param {IProductOptionVariantRepository} productOptionVariantRepository - A product option variant repository.
	 */
	constructor(productRepository: IProductRepository, productModelRepository: IProductModelRepository, productOptionTypeRepository: IProductOptionTypeRepository, productOptionVariantRepository: IProductOptionVariantRepository)
	{
		this.productRepository = productRepository;
		this.productModelRepository = productModelRepository;
		this.productOptionTypeRepository = productOptionTypeRepository;
		this.productOptionVariantRepository = productOptionVariantRepository;
	}
	
	/**
	 * Create a UserProduct.
	 * @param {CreateUserProductCommand} createUserProductCommand - The command containing the necessary information for creating a user product.
	 */
	async createUserProduct(createUserProductCommand: CreateUserProductCommand): Promise<string>
	{
		if(!(createUserProductCommand instanceof CreateUserProductCommand))
			throw new VariableTypeError(PATH, "ProductApplicationService.createProduct()", createUserProductCommand, "CreateProductCommand");

		let userProductId = this.productRepository.nextIdentity();
		let product = new Product(userProductId, createUserProductCommand.productModelId, createUserProductCommand.price, createUserProductCommand.image);

		product = await this._addProductOptionChoicesToProduct(product, createUserProductCommand.productOptionVariantIds);

		await this.productRepository.saveProduct(product);

		return product.id;
	}

	/**
	 * Update a product.
	 * @param {UpdateProductCommand} updateProductCommand - The command containing the necessary information for updating a product.
	 */
	async updateUserProduct(updateProductCommand: UpdateProductCommand): Promise<void>
	{
		if(!(updateProductCommand instanceof UpdateProductCommand))
			throw new VariableTypeError(PATH, "ProductApplicationService.updateProduct()", updateProductCommand, "UpdateProductCommand");
		
		let product = await this.productRepository.getProduct(updateProductCommand.id);

		product.productModelId = updateProductCommand.productModelId;
		product.price = updateProductCommand.price;
		product.image = updateProductCommand.image;
		
		product = await this._addProductOptionChoicesToProduct(product, updateProductCommand.productOptionVariantIds);

		await this.productRepository.updateProduct(product);
	}

	/**
	 * Delete a product.
	 * @param {DeleteProductCommand} deleteProductCommand - The command containing the necessary information for deleting a product.
	 */
	async deleteUserProduct(deleteProductCommand: DeleteProductCommand): Promise<void>
	{
		if(!(deleteProductCommand instanceof DeleteProductCommand))
			throw new VariableTypeError(PATH, "ProductApplicationService.deleteProduct()", deleteProductCommand, "DeleteProductCommand");

		await this.productRepository.deleteProduct(deleteProductCommand.id);
	}

	/**
	 * Add ProductOptionChoices to a product.
	 * @param {List<string>} productOptionVariantIds The ids of the product option variants this product has.
	 * @return {Promise<Product>} The product contianig the ProductOptionChoices.
	 */
	async _addProductOptionChoicesToProduct(product, productOptionVariantIds: List<string>): Promise<Product>
	{
		if(!(productOptionVariantIds instanceof List))
			throw new VariableTypeError(PATH, "ProductApplicationService._changeProduct()", productOptionVariantIds, "List<string>");
		
		let productOptionVariantsList = await this.productOptionVariantRepository.getManyProductOptionVariants(productOptionVariantIds);
		let productOptionVariantsMap = new KVMap<string, ProductOptionVariant>();
		productOptionVariantsList.foreach(variant => {productOptionVariantsMap.add(variant.productOptionTypeId, variant);});

		let productOptionTypes = await this.productOptionTypeRepository.getManyProductOptionTypes(productOptionVariantsMap.keys());
		let productOptionTypesMap = new KVMap<string, ProductOptionType>();
		productOptionTypes.foreach(type => {productOptionTypesMap.add(type.id, type);});

		let productOptionChoices = new KVMap<string, ProductOptionChoice>();
		productOptionVariantsList.foreach((variant: ProductOptionVariant) => {productOptionChoices.add(variant.productOptionTypeId, new ProductOptionChoice(productOptionTypesMap.get(variant.productOptionTypeId), variant));});

		product.productOptionChoices = productOptionChoices;

		return product;
	}

	/**
	 * Get productRepository.
	 * @return {IProductRepository} The repository.
	 */
	get productRepository(): IProductRepository
	{
		return this._productRepository;
	}

	/**
	 * Get productModelRepository.
	 * @return {IProductModelRepository} The repository.
	 */
	get productModelRepository(): IProductModelRepository
	{
		return this._productModelRepository;
	}

	/**
	 * Get productOptionTypeRepository.
	 * @return {IProductOptionTypeRepository} The repository.
	 */
	get productOptionTypeRepository(): IProductOptionTypeRepository
	{
		return this._productOptionTypeRepository;
	}

	/**
	 * Get productOptionVariantRepository.
	 * @return {IProductOptionVariantRepository} The repository.
	 */
	get productOptionVariantRepository(): IProductOptionVariantRepository
	{
		return this._productOptionVariantRepository;
	}

	/**
	 * Set productRepository.
	 * @param {IProductRepository} productRepository - The repository.
	 */
	set productRepository(productRepository: IProductRepository)
	{
		this._productRepository = productRepository;
	}

	/**
	 * Set productModelRepository.
	 * @param {IProductModelRepository} productModelRepository - The repository.
	 */
	set productModelRepository(productModelRepository: IProductModelRepository)
	{
		this._productModelRepository = productModelRepository;
	}

	/**
	 * Set productOptionTypeRepository.
	 * @param {IProductOptionTypeRepository} productOptionTypeRepository - The repository.
	 */
	set productOptionTypeRepository(productOptionTypeRepository: IProductOptionTypeRepository)
	{
		this._productOptionTypeRepository = productOptionTypeRepository;
	}

	/**
	 * Set productOptionVariantRepository.
	 * @param {IProductOptionVariantRepository} productOptionVariantRepository - The repository.
	 */
	set productOptionVariantRepository(productOptionVariantRepository: IProductOptionVariantRepository)
	{
		this._productOptionVariantRepository = productOptionVariantRepository;
	}
}

export default ProductApplicationService;