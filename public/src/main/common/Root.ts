import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";


class Root<T extends AbstractModel<T>> extends QueryElement<T>
{
    constructor(rootElement: T)
    {
        super(rootElement, null);
    }

    protected buildQuery(previousQueryResult: QueryResult<T>) 
    {
        return null;
    }

    /**
     * @override
     */
    async resolve(): Promise<QueryResult<T>>
    {
        let res = new QueryResult<T>();
        res.add(this.model);
        return res;
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