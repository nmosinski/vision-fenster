const PATH = "public/src/main/feature/product/model/ProductOptionVariantRepository.js";

export default class ProductOptionVariantRepository
{
	constructor(id, productOptionId, title, imageSrc=null)
	{
		super(id);
		this.setProductOptionId(productOptionId);
		this.setTitle(title);
		this.setImageSrc(imageSrc);
	}

	getProductOptionId()
	{
		return this.productOptionId;
	}

	getTitle()
	{
		return this.title;
	}

	getImageSrc()
	{
		return this.imageSrc;
	}

	setProductOptionId(productOptionId)
	{
		this.productOptionId = productOptionId;
	}

	setTitle(title)
	{
		this.title = title;
	}

	setImageSrc(imageSrc)
	{
		this.imageSrc = imageSrc;
	}
}