import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";
import Product from "../feature/shoppingCart/model/Product";


class Root<T extends AbstractModel<T>> extends QueryElement<T>
{
    constructor(rootElement: T)
    {
        super(rootElement, null);
    }

    protected async relationalFind(previousQueryResult: QueryResult<T>): Promise<Array<object>>
    {
        return [this.model];
    }

    async save(model: AbstractModel<T>): Promise<void> 
    {   
        AbstractModel.save(model);
    }

    async update(model: AbstractModel<T>): Promise<void> 
    {   
        AbstractModel.update(model);
    }

    /**
     * Destroy this model.
     * Associated models do not get saved/updated/destroyed except their references.
     */
    async destroy(model: AbstractModel<T>): Promise<void>
    {        
        AbstractModel.destroy(model);
    }
}

export default Root;