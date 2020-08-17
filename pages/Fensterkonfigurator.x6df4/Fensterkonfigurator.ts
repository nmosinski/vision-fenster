import ProductModel from "../../public/main/feature/product/model/ProductModel";
import ProductOptionType from "../../public/main/feature/product/model/ProductOptionType";
import ProductOption from "../../public/main/feature/product/model/ProductOption";
import JsString from "../../public/main/common/util/jsTypes/JsString";
import Product from "../../public/main/feature/product/model/Product";
import AbstractProductConfigurationService from "../../public/main/feature/product/service/configurator/AbstractProductConfigurationService";
import ProductConfigurationServiceFactory from "../../public/main/feature/product/factory/ProductConfigurationServiceFactory";
import List from "../../public/main/common/util/collections/list/List";
//import ProductController from "../../backend/main/feature/product/controllers/ProductController";
//@ts-ignore
import { index } from "backend/main/feature/product/controllers/ProductController.jsw";
import QueryResult from "../../public/main/common/orm/QueryResult";
import Tag from "../../public/main/feature/product/model/Tag";

var productModel: ProductModel;
var product: Product;
var productConfiguationService: AbstractProductConfigurationService;
var productOptions: List<ProductOption>;
let cache = [];


//@ts-ignore
$w.onReady(async function () {
	let pm = JSON.parse(await index());
	productModel = (new ProductModel()).fill(pm);
	productModel.typesize(pm);
	console.log(productModel);

	let productModell = (await ProductModel.find(ProductModel)).first();
	await productModell.loadChain(ProductOptionType, ProductOption, Tag);
	console.log("pm", productModell);

	productConfiguationService = ProductConfigurationServiceFactory.byModel(productModel);
	product = new Product();

	productConfiguationService.fillMissingProductOptionsWithDefault(productOptions, product);

	initRepeater();
	applyFilterForRepeater();
	displayProductAsActualConfiguration();
	product.productOptions.foreach(option => updateViewSelectedItems(option.productOptionType.title));
});

function onProductOptionSelection(productOption: ProductOption) {

	console.log(productConfiguationService.setOptionAndDefaultOnComplications(productOption, product, productOptions));
	console.log(product);
	displayProductAsActualConfiguration();
	applyFilterForRepeater();
}

function displayProductAsActualConfiguration(): void {
	//@ts-ignore
	$w("#imageConfiguration").src = product.getOption("profil").image;
	//@ts-ignore
	$w("#textConfigurationPrice").text = "" + product.price + "€";

	//@ts-ignore
	$w("#repeaterConfigurationDetails").data = product.productOptions.toArray();
}

function repeaterConfigurationDetailsOnItemReadyFunction($item: any, productOption: ProductOption, index: number): void {
	$item("#textConfigurationDetails").text = productOption.productOptionType.title + ": " + productOption.value;
}

function updateViewSelectedItems(productOptionTypeTitle: string): void {
	repeaterByProductOptionTypeTitle(productOptionTypeTitle).forEachItem(($item: any, productOption: ProductOption, index: number) => {
		if (product.getOption(productOptionTypeTitle).id === productOption["_id"])
			$item("#vectorImage" + productOptionTypeTitleAsGuiElementName(productOptionTypeTitle)).show();
		else
			$item("#vectorImage" + productOptionTypeTitleAsGuiElementName(productOptionTypeTitle)).hide();
	});
}

function getDefaultOnItemReadyRepeaterFunction(optionTypeTitle: string): Function {
	return ($item, productOption: ProductOption, index: number) => {
		$item("#image" + optionTypeTitle).src = productOption.image;
		$item("#vectorImage" + productOptionTypeTitleAsGuiElementName(optionTypeTitle)).hide();
		$item("#text" + productOptionTypeTitleAsGuiElementName(optionTypeTitle)).text = productOption.productOptionType.title;
		$item("#image" + optionTypeTitle).onClick((event) => {
			onProductOptionSelection(productOption);
			updateViewSelectedItems(productOption.productOptionType.title);
		});
	};
}

function productOptionTypeTitleAsGuiElementName(productOptionTypeTitle: string): string {
	return JsString.capitalizeFirstLetter(JsString.replaceGermanSpecialLetters(productOptionTypeTitle));
}
function repeaterByProductOptionTypeTitle(productOptionTypeTitle: string): any {
	//@ts-ignore
	return $w("#repeater" + productOptionTypeTitleAsGuiElementName(productOptionTypeTitle));
}

function applyFilterForRepeater(): void {
	productModel.productOptionTypes.foreach((productOptionType) => {
		let filteredData = productConfiguationService.filterValidOptions(productOptions, product, productOptionType.title);
		repeaterByProductOptionTypeTitle(productOptionType.title).data = filteredData.toArray();

	});
}

function initRepeater(): void {
	productModel.productOptionTypes.foreach((productOptionType) => {
		let optionTypeTitle = productOptionTypeTitleAsGuiElementName(productOptionType.title);
		let onItemReadyFunction = getDefaultOnItemReadyRepeaterFunction(optionTypeTitle);
		repeaterByProductOptionTypeTitle(optionTypeTitle).onItemReady(onItemReadyFunction);
		repeaterByProductOptionTypeTitle(optionTypeTitle).data = productOptionType.productOptions.toArray();
	});

	//@ts-ignore
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