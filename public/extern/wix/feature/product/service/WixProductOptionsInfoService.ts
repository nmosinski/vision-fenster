import VariableUnspecifiedError from "../../../../../main/common/util/error/VariableUnspecifiedError";
import ProductConfiguration from "../../../../../main/feature/product/model/ProductConfiguration";
import WixProductOptionInfo from "../WixProductOptionInfo";
import WixProductOptionsChoice from "../WixProductOptionsChoice";
import WixProductOptionsInfo from "../WixProductOptionsInfo";

const PATH = 'public/extern/wix/feature/product/service/WixProductOptionsInfoService';

class WixProductOptionsInfoService
{
    public fromProductConfiguration(productConfiguration: ProductConfiguration): WixProductOptionsInfo
    {
        const wixProductOptionsInfo = new WixProductOptionsInfo();

        productConfiguration.productOptions.foreach(productOption =>
        {
            if (!productOption.productOptionType)
                throw new VariableUnspecifiedError(PATH, 'fromProductConfiguration', productOption.productOptionType);

            const wixProductOptionInfo = new WixProductOptionInfo(productOption.productOptionType.presentationde, [new WixProductOptionsChoice(productOption.presentationde, '', true, true)]);
            wixProductOptionsInfo.setWixProductOptionInfo(productOption.productOptionType.presentationde, wixProductOptionInfo);
        });

        return wixProductOptionsInfo;
    }
}

export default WixProductOptionsInfoService;