import WixLocation from "wix-location"

import Logger from "js-logger"

import WixUsersFrontendAuthenticationService from "../../public/main/common/authenticationService/wixUsers/WixUsersFrontendAuthenticationService.js"

import ShoppingCartApplicationService from "../../public/main/feature/shoppingCart/controllers/ShoppingCartApplicationService.js"
import SProductRepository from "public/main/feature/shoppingCart/infrastructure/data/foreignDomains/ProductRepository.js"
import ShoppingCartItemRepository from "public/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartItemRepository.js"
import ShoppingCartRepository from "public/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartRepository.js"

import ProductApplicationService from 'public/src/main/feature/product/application/ProductApplicationService.js'
import CreateUserProductCommand from 'public/src/main/feature/product/application/CreateUserProductCommand.js'

import ProductRepository from 'public/src/main/feature/product/infrastructure/data/wixData/WixDataProductRepository.js'
import ProductModelRepository from 'public/src/main/feature/product/infrastructure/data/wixData/WixDataProductModelRepository.js'
import ProductOptionTypeRepository from 'public/src/main/feature/product/infrastructure/data/wixData/WixDataProductOptionTypeRepository.js'
import ProductOptionVariantRepository from 'public/src/main/feature/product/infrastructure/data/wixData/WixDataProductOptionVariantRepository.js'
import WindowProductConfigurator from 'public/src/main/feature/product/infrastructure/configurator/WindowProductConfigurator.js'
import Product from "public/main/feature/product/model/Product.js"
import ProductOptionChoice from "public/main/feature/product/model/ProductOptionChoice.js"
import ProductOptionVariant from "public/main/feature/product/model/ProductOptionVariant.js"
import ProductOption from "public/main/feature/product/model/ProductOption.js"
import KVMap from "../public/src/main/common/util/collections/map/KVMap.js"

const PRODUCTMODELID = "6b0df06c-cb22-4d60-9550-af1df7de9f3c";
let productRepository;
let productOptionTypeRepository;
let productOptionVariantRepository;
let productOptions;
let configurator;
let product;

let productApplicationService;
let shoppingCartApplicationService;

$w.onReady(async function () 
{
	Logger.useDefaults();
	productOptionTypeRepository = new ProductOptionTypeRepository();
	productOptionVariantRepository = new ProductOptionVariantRepository();
	productRepository = new ProductRepository();

	productOptions = new KVMap<string, ProductOption>();
	if(WixLocation.query.id)
		product = await productRepository.getProduct(WixLocation.query.id);
	else
		product = new Product("123", PRODUCTMODELID, 20, "https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg");
	
	console.log(product);
	let productOptionTypes = await productOptionTypeRepository.getProductOptionTypesByProductModelId(PRODUCTMODELID);
	let tmpProductOptionTypesArr = productOptionTypes.toArray();
	for(let idx in tmpProductOptionTypesArr)
	{
		let variants = await productOptionVariantRepository.getProductOptionVariantsByProductOptionTypeId(tmpProductOptionTypesArr[idx].id);
		let variantsMap = new KVMap<string,ProductOptionVariant>();
		variants.foreach(variant=>{variantsMap.add(variant.id, variant);});
		productOptions.add(tmpProductOptionTypesArr[idx].id, new ProductOption(tmpProductOptionTypesArr[idx], variantsMap));
	}
	configurator = new WindowProductConfigurator();
	productApplicationService = new ProductApplicationService(productRepository, new ProductModelRepository(), productOptionTypeRepository, productOptionVariantRepository);
	shoppingCartApplicationService = new ShoppingCartApplicationService(new ShoppingCartRepository(), new ShoppingCartItemRepository(), new SProductRepository(), new WixUsersFrontendAuthenticationService());

	initRepeater();

	configurator.applyDefaultConfiguration(productOptions, product);
	
	displayProductAsActualConfiguration();
});


function onProductOptionVariantSelection(productOptionTypeId, productOptionVariantId)
{
	configurator.saveProductOptionChoice(new ProductOptionChoice(productOptions.get(productOptionTypeId).type, productOptions.get(productOptionTypeId).variants.get(productOptionVariantId)), product);
	displayProductAsActualConfiguration();
}


function displayProductAsActualConfiguration()
{
	$w("#imageConfiguration").src = product.image;
	$w("#textConfigurationPrice").text = "" + product.price + "€";
	
	let arr = [];
	product.productOptionChoices.keys().foreach(key=>{arr.push({"_id": key, choice: product.productOptionChoices.get(key)});});
	
	setDataForRepeater("#repeaterConfigurationDetails", arr);
	$w("#repeaterConfigurationDetails").forItems(product.productOptionChoices.keys().toArray(), repeaterConfigurationDetailsOnItemReadyFunction);
}

function repeaterConfigurationDetailsOnItemReadyFunction($item, itemData, index)
{
	$item("#textConfigurationDetailsItem").text = itemData.choice.productOptionType.title + ": " + itemData.choice.productOptionVariant.title;
}

function repeaterNameByOptionTypeTitle(optionType)
{
	return "#repeater" + optionType;
}

function getDefaultOnItemReadyRepeaterFunction(optionType)
{
	return ($item, itemData, index)=>{
		$item("#image" + optionType + "Item").src = itemData.image;
		$item("#image" + optionType + "Item").onClick((event)=>{
			onProductOptionVariantSelection(itemData.productOptionTypeId, itemData._id);
		});
	};
}

function setDataForRepeater(repeaterName, data)
{
	$w(repeaterName).data = data;
}

function setOnItemReadyFunctionForRepeater(repeaterName, onItemReadyFunction)
{
	$w(repeaterName).onItemReady(onItemReadyFunction);	
}

function initRepeater()
{
	productOptions.values().foreach((productOption) => {
		let optionTypeTitle = productOption.type.title;
		let onItemReadyFunction = getDefaultOnItemReadyRepeaterFunction(optionTypeTitle);
		setOnItemReadyFunctionForRepeater(repeaterNameByOptionTypeTitle(optionTypeTitle), onItemReadyFunction);
		setDataForRepeater(repeaterNameByOptionTypeTitle(optionTypeTitle), productOption.variants.values().toArray());
	});

	setOnItemReadyFunctionForRepeater("#repeaterConfigurationDetails", repeaterConfigurationDetailsOnItemReadyFunction);
}

export async function onButtonSaveProductClick(event) 
{
	let productId = await productApplicationService.createUserProduct(CreateUserProductCommand.fromProduct(product));
	await shoppingCartApplicationService.addNewItemToCurrentUsersShoppingCart(productId);
	WixLocation.to("/warenkorb");
	
}