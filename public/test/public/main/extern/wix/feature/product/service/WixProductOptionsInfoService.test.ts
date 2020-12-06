import WixProductOptionsInfoService from "../../../../../../../../extern/wix/feature/product/service/WixProductOptionsInfoService";
import WixProductOptionInfo from "../../../../../../../../extern/wix/feature/product/WixProductOptionInfo";
import WixProductOptionsChoice from "../../../../../../../../extern/wix/feature/product/WixProductOptionsChoice";
import QueryResult from "../../../../../../../../main/common/orm/QueryResult";
import { Tests, Test, truthly } from "../../../../../../../../main/common/test/Test";
import { instantiate } from "../../../../../../../../main/common/util/supportive";
import ProductConfiguration from "../../../../../../../../main/feature/product/model/ProductConfiguration";
import ProductModel from "../../../../../../../../main/feature/product/model/ProductModel";
import ProductOption from "../../../../../../../../main/feature/product/model/ProductOption";
import ProductOptionType from "../../../../../../../../main/feature/product/model/ProductOptionType";


const PATH = 'public/test/public/main/extern/wix/feature/';

let productConfiguration: ProductConfiguration;

export async function runAllTests()
{
    const tests = new Tests(beforeAll);

    tests.add(new Test(PATH, "to wix product options info", truthly(), toWixProductOptionsInfo));

    await tests.runAll();
}

function beforeAll()
{
    productConfiguration = new ProductConfiguration();

    productConfiguration.productOptions = new QueryResult([
        new ProductOption({ presentationde: 'Bratwurst' }),
        new ProductOption({ presentationde: 'Kochwurst' }),
        new ProductOption({ presentationde: 'Scheißwurst' })
    ]);

    const productOptionTypePresentationsDe = ['Breakfast', 'Lunch', 'Dinner'];
    productConfiguration.productOptions.foreach((productOption: ProductOption, idx) => productOption.productOptionType = new ProductOptionType({ presentationde: productOptionTypePresentationsDe[idx] }));
}

function toWixProductOptionsInfo()
{
    let ret = true;

    const wixProductOptionsInfo = instantiate(WixProductOptionsInfoService).fromProductConfiguration(productConfiguration);

    productConfiguration.productOptions.foreach(productOption =>
    {
        if (!(wixProductOptionsInfo[productOption.productOptionType.presentationde] instanceof WixProductOptionInfo))
        {
            console.log({ productOption, wixProductOptionsInfo });
            ret = false;
        }
        else if (!wixProductOptionsInfo[productOption.productOptionType.presentationde].equals(new WixProductOptionInfo(productOption.productOptionType.presentationde, [new WixProductOptionsChoice(productOption.presentationde, '', true, true)])))
        {
            console.log({ productOption, wixProductOptionsInfo });
            ret = false;
        }
    });

    return ret;
}