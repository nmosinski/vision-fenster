const PATH = "public/src/main/feature/product/infrastructure/data/wixData/WixDataProductOptionRepository.js";

import wixData from "wix-data"
import ProductOption from "public/src/main/feature/product/model/ProductOption.js"
import ProductOptionVariant from "public/src/main/feature/product/model/ProductOptionVariant.js"
import ClonableList from "public/src/main/common/util/list/ClonableList.js"

export default class WixDataProductOptionRepository
{
	constructor()
	{

	}

	async getProductOptionsByProductModelId(productModelId)
	{
		let productOptionQuery = await wixData.query("product_option").eq("productModelId", productModelId).find();
		let productOptionVariantQuery = await wixData.query("product_option_variant").find();
		let productOptionVariantPictureQuery = await wixData.query("product_option_variant_image").find();
		
		let ret = [];
		let productOptionItems = productOptionQuery.items;
		let productOptionVariantItems = productOptionVariantQuery.items;
		for(let idx1 in productOptionItems)
		{
			let opt = productOptionItems[idx1];
			
			let filteredProductOptionVariantItems = productOptionVariantItems.filter((productOptionVariant)=>{return productOptionVariant.productOptionId === opt._id});
			let productOptionVariants = new ClonableList();

			for(let idx2 in filteredProductOptionVariantItems)
			{
				let oVar = filteredProductOptionVariantItems[idx2];
				let oVarImg;

				for(let idx3 in productOptionVariantPictureQuery.items)
					if(productOptionVariantPictureQuery.items[idx3].productOptionVariantId === oVar._id)
						oVarImg = productOptionVariantPictureQuery.items[idx3].image;
				
				productOptionVariants.add(new ProductOptionVariant(oVar._id, oVar.productOptionId, oVar.title, oVarImg));
			}
			
			ret.push(new ProductOption(opt._id, opt.productModelId, opt.type, productOptionVariants));
		}

		return ret;
	}

}