import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import wixData from "wix-data";
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";
import Root from "./Root";

class OneToZeroOrOne<T extends AbstractModel<T>> extends QueryElement<T>
{   
    constructor(model: T, previous: QueryElement<AbstractModel<any>>=null)
    {
        super(model, previous);
    }

    protected relationalFind(previousQueryResult: QueryResult<T>)
    {
        let query = QueryElement.queryOfModel(this.memberB.tableName);
        query = query.hasSome(this.previous.memberB.asFk(), previousQueryResult.toPks().toArray());
        return query;
    }

    async relationalSave(model: AbstractModel<T>): Promise<void> 
    {
        
    }

    async update(model: AbstractModel<T>): Promise<void> 
    {
        throw new Error("Method not implemented.");
    }

    async destroy(model: AbstractModel<T>): Promise<void> 
    {
        throw new Error("Method not implemented.");
    }
}

export default OneToZeroOrOne;