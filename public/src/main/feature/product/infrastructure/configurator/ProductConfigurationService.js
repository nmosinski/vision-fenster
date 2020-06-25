const PATH = "public/src/main/feature/product/application/ProductApplicationService.js";

import Product from "public/src/main/feature/product/model/Product.js";

export default class ProductApplicationService
{
	constructor(productRepository, productModelRepository, productOptionTypeRepository, productOptionVariantRepository)
	{
		this.productRepository = productRepository;
		this.productModelRepository = productModelRepository;
		this.productOptionTypeRepository = productOptionTypeRepository;
		this.productOptionVariantRepository = productOptionVariantRepository;
		this._product;
		this._configurator;
		this._productModel;
		this._productOptions;
	}

	async _init(productModelId)
	{
		this._productModel = await this.productModelRepository.getProductModel(productModelId);
		this._productOptions = new Map();

		let productOptionTypes = await this.productOptionTypeRepository.getProductOptionTypesByProductModelId(this._productModel.id);
		let tmpProductOptionTypesArr = productOptionTypes.toArray();

		for(let idx in tmpProductOptionTypesArr)
		{
			let productOptionType = tmpProductOptionTypesArr[idx];
			let productOptionVariants = await this.productOptionVariantRepository.getProductOptionVariantsByProductOptionTypeId(productOptionType.id);
			let variantsMap = new Map();
			productOptionVariants.foreach(variant => {variantsMap.add(variant.id, variant);});
			this._productOptions.add(productOptionType.id, new ProductOption(productOptionType, variantsMap));
		}

		switch(this._productModel.id)
		{
			case "FensterModelID": 
				this._configurator = new WindowProductConfigurator();
		}
	}

	async startNewConfiguration(productModelId)
	{
		await this._init(productModelId);
		
		let productId = this._productRepository.nextIdentity();
		this._product = new Product(productId, this._productModel.id, 0, this._productModel.defaultImage);
	}

	async configureExistingProduct(productId)
	{
		this._product = await this.productRepository.get(productId);

		await this._init(this._product.productModelId);
	}

	selectProductOptionVariant(productOptionTypeId, productOptionVariantId)
	{
		let option = this._productOptions.get(productOptionTypeId);
		this._configurator.saveProductOptionChoice(new ProductOptionChoice(option.type, option.variants.get(productOptionVariantId)));
	}

	validProductOptionVariantIds(productOptionTypeId)
	{
		return new List();
	}

	finishConfiguration()
	{
		this.productRepository.saveProduct(this._product);
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