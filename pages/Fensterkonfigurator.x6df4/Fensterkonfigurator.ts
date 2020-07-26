import ProductModel from "../../public/main/feature/product/model/ProductModel";
import ProductOptionType from "../../public/main/feature/product/model/ProductOptionType";
import ProductOption from "../../public/main/feature/product/model/ProductOption";
import JsString from "../../public/main/common/util/jsTypes/JsString";
import Product from "../../public/main/feature/product/model/Product";
import ProductConfigurationService from "../../public/main/feature/product/service/ProductConfigurationService";
import ProductConfigurationServiceFactory from "../../public/main/feature/product/factory/ProductConfigurationServiceFactory";
import Tag from "../../public/main/common/model/Tag";
import List from "../../public/main/common/util/collections/list/List";

const PRODUCT_MODEL_ID = "70b29f09-263e-4eaf-b7f9-8bcdc411b389";
var productModel: ProductModel;
var product: Product;
var productConfiguationService: ProductConfigurationService;
var productOptions: List<ProductOption>;

//@ts-ignore
$w.onReady(async function () {
	productOptions = new List<ProductOption>();
	productModel = await (await ProductModel.get(PRODUCT_MODEL_ID, ProductModel)).load(ProductOptionType);
	await productModel.productOptionTypes.foreachAsync(async (el) => {
		await el.load(ProductOption);
		await el.productOptions.foreachAsync(async (opt) => {
			opt.productOptionType = el;
			await opt.load(Tag);
			productOptions.add(opt);
		});
	});

	productConfiguationService = ProductConfigurationServiceFactory.byModel(productModel);
	product = new Product();

	productConfiguationService.fillMissingProductOptionsWithDefault(productOptions, product);
	console.log(product);
	initRepeater();
	displayProductAsActualConfiguration();
});

function onProductOptionSelection(productOption: ProductOption) {
	productConfiguationService.setOptionAndDefaultOnComplications(productOption, product, productOptions);
	//displayProductAsActualConfiguration();
}


function displayProductAsActualConfiguration(): void {
	//@ts-ignore
	$w("#imageConfiguration").src = product.image;
	//@ts-ignore
	$w("#textConfigurationPrice").text = "" + product.price + "€";

	let arr: Array<any> = [];
	product.productOptions.foreach((opt: ProductOption) => { arr.push({ "_id": opt.id, "option": opt }); });

	setDataForRepeater("#repeaterConfigurationDetails", arr);
	//@ts-ignore
	$w("#repeaterConfigurationDetails").forItems(product.productOptions.toArray(), repeaterConfigurationDetailsOnItemReadyFunction);
}

function repeaterConfigurationDetailsOnItemReadyFunction($item: any, itemData: { id: string, option: ProductOption }, index: number): void {
	console.log(itemData);
	$item("#textConfigurationDetailsItem").text = itemData.option.productOptionType.title + ": " + itemData.option.value;
}

function repeaterNameByOptionTypeTitle(optionTypeTitle: string): string {
	return "#repeater" + JsString.capitalizeFirstLetter(optionTypeTitle);
}

function getDefaultOnItemReadyRepeaterFunction(optionTypeTitle: string): Function {
	return ($item, itemData: any, index: number) => {
		$item("#image" + optionTypeTitle + "Item").src = itemData.image;
		$item("#image" + optionTypeTitle + "Item").onClick((event) => {
			onProductOptionSelection(itemData);
		});
	};
}

function setDataForRepeater(repeaterName: string, data: Array<any>): void {
	//@ts-ignore
	$w(repeaterName).data = data;
}

function setOnItemReadyFunctionForRepeater(repeaterName: string, onItemReadyFunction: Function): void {
	//@ts-ignore
	$w(repeaterName).onItemReady(onItemReadyFunction);
}

function initRepeater(): void {
	productModel.productOptionTypes.foreach((productOptionType) => {
		let optionTypeTitle = JsString.capitalizeFirstLetter(JsString.replaceGermanSpecialLetters(productOptionType.title));
		let onItemReadyFunction = getDefaultOnItemReadyRepeaterFunction(optionTypeTitle);
		setOnItemReadyFunctionForRepeater(repeaterNameByOptionTypeTitle(optionTypeTitle), onItemReadyFunction);
		setDataForRepeater(repeaterNameByOptionTypeTitle(optionTypeTitle), productOptionType.productOptions.toArray());
	});

	setOnItemReadyFunctionForRepeater("#repeaterConfigurationDetails", repeaterConfigurationDetailsOnItemReadyFunction);
}

/*
export async function onButtonSaveProductClick(event)
{
	let productId = await productApplicationService.createUserProduct(CreateUserProductCommand.fromProduct(product));
	await shoppingCartApplicationService.addNewItemToCurrentUsersShoppingCart(productId);
	WixLocation.to("/warenkorb");

}
*/