/* eslint-disable */
import WixProductInfoTranslationService from "../../../../../../../../extern/wix/feature/product/service/WixProductInfoTranslationService";
import WixProductDiscount from "../../../../../../../../extern/wix/feature/product/WixProductDiscount";
import WixProductDiscountType from "../../../../../../../../extern/wix/feature/product/WixProductDiscountType";
import WixProductInfo from "../../../../../../../../extern/wix/feature/product/WixProductInfo";
import WixProductType from "../../../../../../../../extern/wix/feature/product/WixProductType";
import QueryResult from "../../../../../../../../main/common/orm/QueryResult";
import { Tests, Test, truthly } from "../../../../../../../../main/common/test/Test";
import { areEqual, instantiate } from "../../../../../../../../main/common/util/supportive";
import ProductConfiguration from "../../../../../../../../main/feature/product/model/ProductConfiguration";
import ProductModel from "../../../../../../../../main/feature/product/model/ProductModel";
import ProductOption from "../../../../../../../../main/feature/product/model/ProductOption";
import ProductOptionType from "../../../../../../../../main/feature/product/model/ProductOptionType";
import { ProductModels } from "../../../../../../../../main/feature/product/productModels";


const PATH = 'public/test/public/main/extern/wix/feature/WixProductInfoTranslationService.test.ts';

let productConfiguration: ProductConfiguration;

export async function runAllTests()
{
    const tests = new Tests(beforeAll);

    tests.add(new Test(PATH, "from product configuration", truthly(), fromProductConfiguration));

    await tests.runAll();
}

function beforeAll()
{
    const productOptions = new QueryResult([
        new ProductOption({ presentationde: 'Bratwurst' }),
        new ProductOption({ presentationde: 'Kochwurst' }),
        new ProductOption({ presentationde: 'Scheißwurst' })
    ]);

    const productOptionTypePresentationsDe = ['Breakfast', 'Lunch', 'Dinner'];
    productOptions.foreach((productOption: ProductOption, idx: number) => productOption.productOptionType = new ProductOptionType({ presentationde: productOptionTypePresentationsDe[idx] }));

    productConfiguration = new ProductConfiguration();
    productOptions.foreach(productOption => productConfiguration.saveOption(productOption));
    productConfiguration.productModel = new ProductModel({ title: ProductModels.FENSTER });
}

function fromProductConfiguration()
{
    let ret = true;

    const wixProductInfo = instantiate(WixProductInfoTranslationService).fromProductConfiguration(productConfiguration);
    const expectedWixProductInfo = new WixProductInfo(
        'Fenster',
        '',
        '',
        productConfiguration.price,
        new WixProductDiscount(WixProductDiscountType.NONE, ''),
        wixProductInfo.productOptions,
        false,
        WixProductType.PHYSICAL,
        1,
        true
    );

    if (!areEqual(expectedWixProductInfo, wixProductInfo))
    {
        console.log({ wixProductInfo, expectedWixProductInfo });
        return false;
    }

    return ret;
}