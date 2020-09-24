import AbstractModel from "../../../../common/orm/AbstractModel";
import QueryResult from "../../../../common/orm/QueryResult";
import { Query } from "../../../../common/orm/WixDatabase";
import List from "../../../../common/util/collections/list/List";
import { AnyNumber } from "../../../../common/util/supportive";
import ProductOption from "../../model/ProductOption";

class FensterBasePriceT extends AbstractModel<FensterBasePriceT>
{
    protected Constructor: new () => FensterBasePriceT;
    protected modelName: string;
    private _productOptions: QueryResult<ProductOption>;

    init(): void
    {
        this.Constructor = FensterBasePriceT;
        this.modelName = 'FensterBasePriceT';

        this.productOptions = new QueryResult<ProductOption>();
    }

    addProperties(): void
    {
        this.properties.string('tableName');
    }

    addRelations(): void
    {
        this.manyToMany(ProductOption);
    }

    hasProductOptions(productOptions: AnyNumber<ProductOption>)
    {
        productOptions = new List<ProductOption>(productOptions);
        return productOptions.isSublistOf(this.productOptions);
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