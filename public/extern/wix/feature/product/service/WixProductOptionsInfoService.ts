import List from "../../../../../main/common/util/collections/list/List";
import VariableUnspecifiedError from "../../../../../main/common/util/error/VariableUnspecifiedError";
import ProductOption from "../../../../../main/feature/product/model/ProductOption";
import WixProductOptionInfo from "../WixProductOptionInfo";
import WixProductOptionsChoice from "../WixProductOptionsChoice";
import WixProductOptionsInfo from "../WixProductOptionsInfo";

const PATH = 'public/extern/wix/feature/product/service/WixProductOptionsInfoService';

class WixProductOptionsInfoService
{
    public fromProductOptions(productOptions: List<ProductOption>): WixProductOptionsInfo
    {
        const wixProductOptionsInfo = new WixProductOptionsInfo();

        productOptions.foreach(productOption =>
        {
            if (!productOption.productOptionType)
                throw new VariableUnspecifiedError(PATH, 'fromProductOptions', productOption.productOptionType);

            const wixProductOptionInfo = new WixProductOptionInfo(productOption.productOptionType.presentationde, [new WixProductOptionsChoice(productOption.presentationde, '', true, true)]);
            wixProductOptionsInfo.setWixProductOptionInfo(productOption.productOptionType.presentationde, wixProductOptionInfo);
        });

        return wixProductOptionsInfo;
    }
}

export default WixProductOptionsInfoService;