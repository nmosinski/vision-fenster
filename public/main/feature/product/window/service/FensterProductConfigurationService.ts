import productDefinitions from "../../productDefinitions";
import ProductOption from "../../model/ProductOption";
import ProductConfiguration from "../../model/ProductConfiguration";
import ProductDefinition from "../../model/ProductDefinition";
import { FensterProductOptionTypes } from "../../productOptionTypes";
import { ProductModels } from "../../productModels";
import KVMap from "../../../../common/util/collections/map/KVMap";
import DynamicBasePriceModel from "../../window/model/DynamicBasePriceModel";
import List from "../../../../common/util/collections/list/List";
import FensterBasePriceT from "../../window/model/FensterBasePriceT";
import AbstractProductConfigurationService from "../../service/configurator/AbstractProductConfigurationService";
import ProductDefinitionParsingService from "../../service/ProductDefinitionParsingService";
import PriceCalculationImpossibleError from "../../error/PriceCalculationImpossibleError";
import NullPointerException from "../../../../common/util/error/NullPointerException";
import AbstractStorableModel from "../../../../common/orm/AbstractStorableModel";

const PATH = 'public/main/feature/product/window/service/FensterProductConfigurationService';

class FensterProductConfigurationService extends AbstractProductConfigurationService
{
    private _cachedBasePriceModels: KVMap<string, List<DynamicBasePriceModel>>;
    private _fensterBasePriceTs: List<FensterBasePriceT>;

    constructor (productDefinition?: ProductDefinition)
    {
        super((productDefinition) ? productDefinition : ProductDefinitionParsingService.parseFromJson(productDefinitions).get(ProductModels.FENSTER));

        this.cachedBasePriceModels = new KVMap<string, List<DynamicBasePriceModel>>();
        this.fensterBasePriceTs = new List<FensterBasePriceT>();

    }

    async init(): Promise<void>
    {
        this.fensterBasePriceTs = await AbstractStorableModel.find(FensterBasePriceT);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeSetOption(productOption: ProductOption, product: ProductConfiguration): void
    {

    }

    afterSetOption(productOption: ProductOption, product: ProductConfiguration): void
    {
        if (productOption.productOptionType.title === FensterProductOptionTypes.PROFIL)
            product.image = productOption.image;
    }

    async calculatePrice(product: ProductConfiguration): Promise<number>
    {
        const basePriceT = this.findBasePriceT(product);
        let dynamicBasePriceModels: List<DynamicBasePriceModel>;
        let basePriceModel: DynamicBasePriceModel;

        if (this.cachedBasePriceModels.hasKey(basePriceT.priceTableName))
            dynamicBasePriceModels = this.cachedBasePriceModels.get(basePriceT.priceTableName);
        else
        {
            dynamicBasePriceModels = await (new DynamicBasePriceModel({ 'tableName': basePriceT.priceTableName })).find();
            this.cachedBasePriceModels.add(basePriceT.priceTableName, dynamicBasePriceModels);
        }

        try
        {
            basePriceModel = dynamicBasePriceModels.find(dynamicBasePriceModel =>
            {
                return dynamicBasePriceModel.width === product.getOption(FensterProductOptionTypes.WIDTH).value && dynamicBasePriceModel.height === product.getOption(FensterProductOptionTypes.HEIGHT).value;
            });
        } catch (err)
        {
            if (err instanceof NullPointerException)
                throw new PriceCalculationImpossibleError('The base price model could not be found for the product ' + product.toString(), PATH, 'calculatePrice');

            throw err;
        }

        return basePriceModel.price;
    }

    private findBasePriceT(product: ProductConfiguration): FensterBasePriceT
    {
        try
        {
            return this.fensterBasePriceTs.filter(fensterBasePriceT => fensterBasePriceT.hasProductOptions(product.productOptions)).first();
        } catch (err)
        {
            throw new PriceCalculationImpossibleError(undefined, PATH, 'findBasePriceT');
        }
    }

    private set cachedBasePriceModels(map: KVMap<string, List<DynamicBasePriceModel>>)
    {
        this._cachedBasePriceModels = map;
    }

    private get cachedBasePriceModels(): KVMap<string, List<DynamicBasePriceModel>>
    {
        return this._cachedBasePriceModels;
    }

    private set fensterBasePriceTs(fensterBasePriceTs: List<FensterBasePriceT>)
    {
        this._fensterBasePriceTs = fensterBasePriceTs;
    }

    private get fensterBasePriceTs(): List<FensterBasePriceT>
    {
        return this._fensterBasePriceTs;
    }
}

export default FensterProductConfigurationService;