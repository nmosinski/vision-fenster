import ProductModel from "../../public/main/feature/product/model/ProductModel";
import ProductOptionType from "../../public/main/feature/product/model/ProductOptionType";
import ProductOption from "../../public/main/feature/product/model/ProductOption";
import JsString from "../../public/main/common/util/jsTypes/JsString";
import ProductConfiguration from "../../public/main/feature/product/model/ProductConfiguration";
import AbstractProductConfigurationService from "../../public/main/feature/product/service/configurator/AbstractProductConfigurationService";
import ProductConfigurationServiceFactory from "../../public/main/feature/product/factory/ProductConfigurationServiceFactory";
import Tag from "../../public/main/feature/product/model/Tag";
import { FensterProductOptionTypes } from "../../public/main/feature/product/productOptionTypes";
import AbstractStorableModel from "../../public/main/common/orm/AbstractStorableModel";
import QueryResult from "../../public/main/common/orm/QueryResult";

let productModel: ProductModel;
let product: ProductConfiguration;
let productConfiguationService: AbstractProductConfigurationService;
let allProductOptions: QueryResult<ProductOption>;

// @ts-ignore
$w.onReady(async function ()
{
	// retrieve data
	productModel = (await AbstractStorableModel.find(ProductModel)).first();
	allProductOptions = await productModel.productOptionTypesQ().productOptionsQ().find();
	await allProductOptions.load([ProductOptionType, Tag]);

	product = new ProductConfiguration();

	productConfiguationService = ProductConfigurationServiceFactory.byModel(productModel);
	productConfiguationService.fillMissingProductOptionsWithDefault(allProductOptions, product);

	initRepeater();
	applyFilterForRepeater();
	displayProductAsActualConfiguration();
	updateAllSelectedItemViews();
});

function onProductOptionSelection(productOption: ProductOption)
{
	updateSelectedItemView(productOption.productOptionType.title);
	productConfiguationService.setOptionAndDefaultOnComplications(productOption, product, allProductOptions);
	displayProductAsActualConfiguration();
	applyFilterForRepeater();
	updateAllSelectedItemViews();
}

function displayProductAsActualConfiguration(): void
{
	// @ts-ignore
	$w("#imageConfiguration").src = (product.hasOption(FensterProductOptionTypes.PROFIL)) ? product.getOption(FensterProductOptionTypes.PROFIL).image : 'https://wuerdest-du-eher.de/ratgeber/wp-content/uploads/2017/07/was-heisst-nope-auf-deutsch.jpg';
	// @ts-ignore
	$w("#textConfigurationPrice").text = "" + product.price + "€";

	// @ts-ignore
	$w("#repeaterConfigurationDetails").data = product.productOptions.toArray();
}

function repeaterConfigurationDetailsOnItemReadyFunction($item: any, productOption: ProductOption): void
{
	$item("#textConfigurationDetails").text = productOption.productOptionType.presentationde + ": " + productOption.presentationde;
}

function updateAllSelectedItemViews()
{
	product.productOptions.foreach(option => updateSelectedItemView(option.productOptionType.title));

}

function updateSelectedItemView(productOptionTypeTitle: string): void
{
	repeaterByProductOptionTypeTitle(productOptionTypeTitle).forEachItem(($item: any, productOption: ProductOption) =>
	{
		if (product.getOption(productOptionTypeTitle).id === productOption.id)
			$item("#vectorImage" + productOptionTypeTitleAsGuiElementName(productOptionTypeTitle)).show();
		else
			$item("#vectorImage" + productOptionTypeTitleAsGuiElementName(productOptionTypeTitle)).hide();
	});
}

function getDefaultOnItemReadyRepeaterFunction(optionTypeTitle: string): (item: any, productOption: ProductOption) => void
{
	return ($item, productOption: ProductOption) =>
	{
		$item("#image" + optionTypeTitle).src = productOption.image;
		$item("#vectorImage" + productOptionTypeTitleAsGuiElementName(optionTypeTitle)).hide();
		$item("#text" + productOptionTypeTitleAsGuiElementName(optionTypeTitle)).text = productOption.presentationde;
		$item("#image" + optionTypeTitle).onClick(() =>
		{
			onProductOptionSelection(productOption);
		});
	};
}

function productOptionTypeTitleAsGuiElementName(productOptionTypeTitle: string): string
{
	return JsString.capitalizeFirstLetter(JsString.replaceGermanSpecialLetters(productOptionTypeTitle));
}
function repeaterByProductOptionTypeTitle(productOptionTypeTitle: string): any
{
	// @ts-ignore
	return $w("#repeater" + productOptionTypeTitleAsGuiElementName(productOptionTypeTitle));
}

function applyFilterForRepeater(): void
{
	productModel.productOptionTypes.foreach((productOptionType) =>
	{
		const filteredData = productConfiguationService.filterValidOptions(allProductOptions, product, productOptionType.title);
		repeaterByProductOptionTypeTitle(productOptionType.title).data = filteredData.toArray();

	});
}

function initRepeater(): void
{
	productModel.productOptionTypes.foreach((productOptionType) =>
	{
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