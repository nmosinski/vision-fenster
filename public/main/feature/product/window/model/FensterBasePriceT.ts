import AbstractModel from "../../../../common/orm/AbstractModel";
import AbstractStorableModel from "../../../../common/orm/AbstractStorableModel";
import QueryResult from "../../../../common/orm/QueryResult";
import List from "../../../../common/util/collections/list/List";
import { AnyNumber } from "../../../../common/util/supportive";
import ProductOption from "../../model/ProductOption";
import DynamicBasePriceModel from "./DynamicBasePriceModel";

class FensterBasePriceT extends AbstractStorableModel<FensterBasePriceT>
{
    protected Constructor: new () => FensterBasePriceT;
    protected modelName: string;
    private _productOptions: QueryResult<ProductOption>;
    private _priceTableName: string;

    init(): void
    {
        this.Constructor = FensterBasePriceT;
        this.modelName = 'FensterBasePriceT';

        this.productOptions = new QueryResult<ProductOption>();
    }

    addProperties(): void
    {
        this.properties.string('priceTableName');
    }

    addRelations(): void
    {
        this.manyToMany(ProductOption);
        this.oneToMany(DynamicBasePriceModel);
    }

    hasProductOptions(productOptions: AnyNumber<ProductOption>)
    {
        productOptions = new List<ProductOption>(productOptions);
        return productOptions.isSublistOf(this.productOptions);
    }

    set priceTableName(priceTableName: string)
    {
        this._priceTableName = priceTableName;
    }

    get priceTableName(): string
    {
        return this._priceTableName;
    }

    get productOptions(): QueryResult<ProductOption>
    {
        return this._productOptions;
    }

    set productOptions(productOptions: QueryResult<ProductOption>)
    {
        this._productOptions = productOptions;
    }
}

export default FensterBasePriceT;