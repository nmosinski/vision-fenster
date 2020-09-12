import ProductModel from "../../public/main/feature/product/model/ProductModel";
import ProductOptionType from "../../public/main/feature/product/model/ProductOptionType";
import ProductOption from "../../public/main/feature/product/model/ProductOption";
import JsString from "../../public/main/common/util/jsTypes/JsString";
import Product from "../../public/main/feature/product/model/Product";
import AbstractProductConfigurationService from "../../public/main/feature/product/service/configurator/AbstractProductConfigurationService";
import ProductConfigurationServiceFactory from "../../public/main/feature/product/factory/ProductConfigurationServiceFactory";
import List from "../../public/main/common/util/collections/list/List";
// @ts-ignore
import { index } from "backend/main/feature/product/controllers/ProductController.jsw";
import Tag from "../../public/main/feature/product/model/Tag";

let productModel: ProductModel;
let product: Product;
let productConfiguationService: AbstractProductConfigurationService;
let allProductOptions: List<ProductOption>;

// @ts-ignore
$w.onReady(async () => {
	// retrieve data
	productModel = (await ProductModel.find(ProductModel)).first();
	await productModel.loadChain([ProductOptionType, ProductOption, Tag]);

	// merge all product options
	allProductOptions = new List<ProductOption>();
	productModel.productOptionTypes.foreach(types => allProductOptions = allProductOptions.OR(types.productOptions));

	product = new Product();

	productConfiguationService = ProductConfigurationServiceFactory.byModel(productModel);


	productConfiguationService.fillMissingProductOptionsWithDefault(allProductOptions, product);

	initRepeater();
	applyFilterForRepeater();
	displayProductAsActualConfiguration();
	updateallSelectedItemViews();
});

function onProductOptionSelection(productOption: ProductOption) {
	updateSelectedItemView(productOption.productOptionType.title);
	productConfiguationService.setOptionAndDefaultOnComplications(productOption, product, allProductOptions);
	displayProductAsActualConfiguration();
	applyFilterForRepeater();
	updateallSelectedItemViews();
}

function displayProductAsActualConfiguration(): void {
	// @ts-ignore
	$w("#imageConfiguration").src = (product.hasOption('profil')) ? product.getOption("profil").image : 'https://wuerdest-du-eher.de/ratgeber/wp-content/uploads/2017/07/was-heisst-nope-auf-deutsch.jpg';
	// @ts-ignore
	$w("#textConfigurationPrice").text = "" + product.price + "€";

	// @ts-ignore
	$w("#repeaterConfigurationDetails").data = product.productOptions.toArray();
}

function repeaterConfigurationDetailsOnItemReadyFunction($item: any, productOption: ProductOption): void {
	$item("#textConfigurationDetails").text = productOption.productOptionType.title + ": " + productOption.value;
}

function updateallSelectedItemViews() {
	product.productOptions.foreach(option => updateSelectedItemView(option.productOptionType.title));
}

function updateSelectedItemView(productOptionTypeTitle: string): void {
	repeaterByProductOptionTypeTitle(productOptionTypeTitle).forEachItem(($item: any, productOption: ProductOption) => {
		if (product.getOption(productOptionTypeTitle).id === productOption.id)
			$item("#vectorImage" + productOptionTypeTitleAsGuiElementName(productOptionTypeTitle)).show();
		else
			$item("#vectorImage" + productOptionTypeTitleAsGuiElementName(productOptionTypeTitle)).hide();
	});
}

function getDefaultOnItemReadyRepeaterFunction(optionTypeTitle: string): (item: any, productOption: ProductOption) => void {
	return ($item, productOption: ProductOption) => {
		$item("#image" + optionTypeTitle).src = productOption.image;
		$item("#vectorImage" + productOptionTypeTitleAsGuiElementName(optionTypeTitle)).hide();
		$item("#text" + productOptionTypeTitleAsGuiElementName(optionTypeTitle)).text = productOption.productOptionType.title;
		$item("#image" + optionTypeTitle).onClick((event: any) => {
			onProductOptionSelection(productOption);
		});
	};
}

function productOptionTypeTitleAsGuiElementName(productOptionTypeTitle: string): string {
	return JsString.capitalizeFirstLetter(JsString.replaceGermanSpecialLetters(productOptionTypeTitle));
}
function repeaterByProductOptionTypeTitle(productOptionTypeTitle: string): any {
	// @ts-ignore
	return $w("#repeater" + productOptionTypeTitleAsGuiElementName(productOptionTypeTitle));
}

function applyFilterForRepeater(): void {
	productModel.productOptionTypes.foreach((productOptionType) => {
		const filteredData = productConfiguationService.filterValidOptions(allProductOptions, product, productOptionType.title);
		repeaterByProductOptionTypeTitle(productOptionType.title).data = filteredData.toArray();

	});
}

function initRepeater(): void {
	productModel.productOptionTypes.foreach((productOptionType) => {
		const optionTypeTitle = productOptionTypeTitleAsGuiElementName(productOptionType.title);
		const onItemReadyFunction = getDefaultOnItemReadyRepeaterFunction(optionTypeTitle);
		repeaterByProductOptionTypeTitle(optionTypeTitle).onItemReady(onItemReadyFunction);
		repeaterByProductOptionTypeTitle(optionTypeTitle).data = productOptionType.productOptions.toArray();
	});

	// @ts-ignore
	$w("#repeaterConfigurationDetails").onItemReady(repeaterConfigurationDetailsOnItemReadyFunction);
}

/*
export async function onButtonSaveProductClick(event)
{
	let productId = await productApplicationService.createUserProduct(CreateUserProductCommand.fromProduct(product));
	await shoppingCartApplicationService.addNewItemToCurrentUsersShoppingCart(productId);
	WixLocation.to("/warenkorb");

}
*/