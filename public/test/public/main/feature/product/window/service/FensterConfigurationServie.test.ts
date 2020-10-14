import QueryResult from "../../../../../../../main/common/orm/QueryResult";
import { Tests, Test, truthly, value } from "../../../../../../../main/common/test/Test";
import Product from "../../../../../../../main/feature/product/model/Product";
import ProductModel from "../../../../../../../main/feature/product/model/ProductModel";
import ProductOption from "../../../../../../../main/feature/product/model/ProductOption";
import ProductOptionType from "../../../../../../../main/feature/product/model/ProductOptionType";
import Tag from "../../../../../../../main/feature/product/model/Tag";
import productDefinitions from "../../../../../../../main/feature/product/productDefinitions";
import { FensterProductOptionTypes } from "../../../../../../../main/feature/product/productOptionTypes";
import ProductDefinitionParsingService from "../../../../../../../main/feature/product/service/ProductDefinitionParsingService";
import { FensterTags } from "../../../../../../../main/feature/product/tags";
import FensterProductConfigurationService from "../../../../../../../main/feature/product/window/service/FensterProductConfigurationService";

const PATH = "test/public/main/feature/product/FensterConfigurationService.test.js"

let product: Product;
let fensterProductConfigurationService: FensterProductConfigurationService;

export async function runAllTests()
{
    const tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

    tests.add(new Test(PATH, "price is being calculated", truthly(), priceIsBeingCalculated));

    await tests.runAll();
}

async function beforeAll()
{
    product = new Product();
    fensterProductConfigurationService = new FensterProductConfigurationService();

    const productModel = (await ProductModel.find(ProductModel)).first();
    const productOptions = await productModel.productOptionTypesQ().productOptionsQ().find();
    await productOptions.load([ProductOptionType, Tag]);

    fensterProductConfigurationService.fillMissingProductOptionsWithDefault(productOptions, product);
}

async function beforeEach()
{

}

async function afterEach()
{

}

async function priceIsBeingCalculated()
{
    const price = await fensterProductConfigurationService.calculatePrice(product);
    if (price < 10)
    {
        console.log('first if');
        console.log('calculated price:', price);
        return false;
    }

    return true;
}