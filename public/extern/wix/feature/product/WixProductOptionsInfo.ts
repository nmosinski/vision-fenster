import KVMap from "../../../../main/common/util/collections/map/KVMap";
import WixProductOptionInfo from "./WixProductOptionInfo";

class WixProductOptionsInfo
{
    constructor (wixProductOptionInfos: KVMap<string, WixProductOptionInfo> = new KVMap<string, WixProductOptionInfo>())
    {
        wixProductOptionInfos.foreach((attributeName, wixProductOptionInfo) => this.setWixProductOptionInfo(attributeName, wixProductOptionInfo));
    }

    setWixProductOptionInfo(key: string, wixProductOptionInfo: WixProductOptionInfo): void
    {
        this[key] = wixProductOptionInfo;
    }

    unsetWixProductOptionInfo(key: string): void
    {
        delete this[key];
    }
}

export default WixProductOptionsInfo;