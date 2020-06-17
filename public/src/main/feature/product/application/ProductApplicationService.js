const PATH = "public/src/main/feature/product/application/ProductApplicationService.js";

import CreateProductCommand from "public/src/main/feature/product/application/CreateProductCommand.js";
import UpdateProductCommand from "public/src/main/feature/product/application/UpdateProductCommand.js";
import DeleteProductCommand from "public/src/main/feature/product/application/DeleteProductCommand.js";
import Product from "public/src/main/feature/product/model/Product.js";
import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js";
import IProductRepository from "public/src/main/feature/product/model/IProductRepository.js";
import IProductModelRepository from "public/src/main/feature/product/model/IProductModelRepository.js";
import IProductOptionTypeRepository from "public/src/main/feature/product/model/IProductOptionTypeRepository.js";
import IProductOptionVariantRepository from "public/src/main/feature/product/model/IProductOptionVariantRepository.js";

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"
import List from "public/src/main/common/util/list/List.js"
import ClonableKVMap from "public/src/main/common/util/map/ClonableKVMap.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"

/**
 * @class
 * Class representing the application service of product domain.
 */
class ProductApplicationService
{
	/**
	 * Create a ProductApplicationService.
	 * @param {IProductRepository} productRepository - A product repository.
	 * @param {IProductModelRepository} productModelRepository - A product model repository.
	 * @param {IProductOptionTypeRepository} productOptionTypeRepository - A product option type repository.
	 * @param {IProductOptionVariantRepository} productOptionVariantRepository - A product option variant repository.
	 */
	constructor(productRepository, productModelRepository, productOptionTypeRepository, productOptionVariantRepository)
	{
		this.productRepository = productRepository;
		this.productModelRepository = productModelRepository;
		this.productOptionTypeRepository = productOptionTypeRepository;
		this.productOptionVariantRepository = productOptionVariantRepository;
	}
	
	/**
	 * Create a product.
	 * @param {CreateProductCommand} createProductCommand - The command containing the necessary information for creating a product.
	 */
	async createProduct(createProductCommand)
	{
		if(!(createProductCommand instanceof CreateProductCommand))
			throw new VariableTypeError(PATH, "ProductApplicationService.createProduct()", createProductCommand, "CreateProductCommand");

		let productId = this.productRepository.nextIdentity();
		let product = new Product(productId, createProductCommand.productModelId, createProductCommand.price, createProductCommand.image);

		product = await this._addProductOptionChoicesToProduct(product, createProductCommand.productOptionVariantIds);

		await this.productRepository.saveProduct(product);

		return product.id;
	}

	/**
	 * Update a product.
	 * @param {UpdateProductCommand} updateProductCommand - The command containing the necessary information for updating a product.
	 */
	async updateProduct(updateProductCommand)
	{
		if(!(updateProductCommand instanceof UpdateProductCommand))
			throw new VariableTypeError(PATH, "ProductApplicationService.updateProduct()", updateProductCommand, "UpdateProductCommand");
		
		let product = await this.productRepository.getProduct(updateProductCommand.productId);

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
	async deleteProduct(deleteProductCommand)
	{
		if(!(deleteProductCommand instanceof DeleteProductCommand))
			throw new VariableTypeError(PATH, "ProductApplicationService.deleteProduct()", deleteProductCommand, "DeleteProductCommand");

		await this.productRepository.deleteProduct(deleteProductCommand.productId);
	}

	/**
	 * Add ProductOptionChoices to a product.
	 * @param {List<string>} [productOptionVariantIds] The ids of the product option variants this product has.
	 * @return {Product} The product contianig the ProductOptionChoices.
	 */
	async _addProductOptionChoicesToProduct(product, productOptionVariantIds)
	{
		if(!(productOptionVariantIds instanceof List))
			throw new VariableTypeError(PATH, "ProductApplicationService._changeProduct()", productOptionVariantIds, "List<string>");
		
		let productOptionVariantsList = await this.productOptionVariantRepository.getManyProductOptionVariants(productOptionVariantIds);
		let productOptionVariantsMap = new ClonableKVMap();
		productOptionVariantsList.foreach(variant => {productOptionVariantsMap.add(variant.productOptionTypeId, variant);});

		let productOptionTypes = await this.productOptionTypeRepository.getManyProductOptionTypes(productOptionVariantsMap.keys());
		let productOptionTypesMap = new KVMap();
		productOptionTypes.foreach(type => {productOptionTypesMap.add(type.id, type);});

		let productOptionChoices = new ClonableKVMap();
		productOptionVariantsList.foreach(variant => {productOptionChoices.add(variant.productOptionTypeId, new ProductOptionChoice(productOptionTypesMap.get(variant.productOptionTypeId), variant));});

		product.productOptionChoices = productOptionChoices;

		return product;
	}

	/**
	 * Get productRepository.
	 * @return {IProductRepository} The repository.
	 */
	get productRepository()
	{
		return this._productRepository;
	}

	/**
	 * Get productModelRepository.
	 * @return {IProductModelRepository} The repository.
	 */
	get productModelRepository()
	{
		return this._productModelRepository;
	}

	/**
	 * Get productOptionTypeRepository.
	 * @return {IProductOptionTypeRepository} The repository.
	 */
	get productOptionTypeRepository()
	{
		return this._productOptionTypeRepository;
	}

	/**
	 * Get productOptionVariantRepository.
	 * @return {IProductOptionVariantRepository} The repository.
	 */
	get productOptionVariantRepository()
	{
		return this._productOptionVariantRepository;
	}

	/**
	 * Set productRepository.
	 * @param {IProductRepository} [productRepository] - The repository.
	 */
	set productRepository(productRepository)
	{
		if(!(productRepository instanceof IProductRepository))
			throw new VariableTypeError(PATH, "ProductApplicationService.set productRepository", productRepository, "IProductRepository");
		
		this._productRepository = productRepository;
	}

	/**
	 * Set productModelRepository.
	 * @param {IProductModelRepository} [productModelRepository] - The repository.
	 */
	set productModelRepository(productModelRepository)
	{
		if(!(productModelRepository instanceof IProductModelRepository))
			throw new VariableTypeError(PATH, "ProductApplicationService.set productModelRepository", productModelRepository, "IProductModelRepository");
		
		this._productModelRepository = productModelRepository;
	}

	/**
	 * Set productOptionTypeRepository.
	 * @param {IProductOptionTypeRepository} [productOptionTypeRepository] - The repository.
	 */
	set productOptionTypeRepository(productOptionTypeRepository)
	{
		if(!(productOptionTypeRepository instanceof IProductOptionTypeRepository))
			throw new VariableTypeError(PATH, "ProductApplicationService.set productOptionTypeRepository", productOptionTypeRepository, "IProductOptionTypeRepository");
		
		this._productOptionTypeRepository = productOptionTypeRepository;
	}

	/**
	 * Set productOptionVariantRepository.
	 * @param {IProductOptionVariantRepository} [productOptionVariantRepository] - The repository.
	 */
	set productOptionVariantRepository(productOptionVariantRepository)
	{
		if(!(productOptionVariantRepository instanceof IProductOptionVariantRepository))
			throw new VariableTypeError(PATH, "ProductApplicationService.set productOptionVariantRepository", productOptionVariantRepository, "IProductOptionVariantRepository");
		
		this._productOptionVariantRepository = productOptionVariantRepository;
	}
}

export default ProductApplicationService;