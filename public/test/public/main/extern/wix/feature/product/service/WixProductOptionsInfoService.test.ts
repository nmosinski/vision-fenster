/* eslint-disable */
import WixProductOptionsInfoService from "../../../../../../../../extern/wix/feature/product/service/WixProductOptionsInfoService";
import WixProductOptionInfo from "../../../../../../../../extern/wix/feature/product/WixProductOptionInfo";
import WixProductOptionsChoice from "../../../../../../../../extern/wix/feature/product/WixProductOptionsChoice";
import QueryResult from "../../../../../../../../main/common/orm/QueryResult";
import { Tests, Test, truthly } from "../../../../../../../../main/common/test/Test";
import List from "../../../../../../../../main/common/util/collections/list/List";
import { instantiate } from "../../../../../../../../main/common/util/supportive";
import ProductOption from "../../../../../../../../main/feature/product/model/ProductOption";
import ProductOptionType from "../../../../../../../../main/feature/product/model/ProductOptionType";


const PATH = 'public/test/public/main/extern/wix/feature/WixProductOptionsInfoService.test.ts';

let productOptions: List<ProductOption>;

export async function runAllTests()
{
    const tests = new Tests(beforeAll);

    tests.add(new Test(PATH, "from product options", truthly(), fromProductOptions));

    await tests.runAll();
}

function beforeAll()
{
    productOptions = new QueryResult([
        new ProductOption({ presentationde: 'Bratwurst' }),
        new ProductOption({ presentationde: 'Kochwurst' }),
        new ProductOption({ presentationde: 'Scheißwurst' })
    ]);

    const productOptionTypePresentationsDe = ['Breakfast', 'Lunch', 'Dinner'];
    productOptions.foreach((productOption: ProductOption, idx: number) => productOption.productOptionType = new ProductOptionType({ presentationde: productOptionTypePresentationsDe[idx] }));
}

function fromProductOptions()
{
    let ret = true;

    const wixProductOptionsInfo = instantiate(WixProductOptionsInfoService).fromProductOptions(productOptions);

    productOptions.foreach(productOption =>
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