import Relation from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import wixData from "wix-data";
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";
import Root from "./Root";

class ZeroOrOneToOne<T extends AbstractModel<T>> extends Relation<T>
{   
    constructor(model: T, previous: Relation<AbstractModel<any>>=null)
    {
        super(model, previous);
    }

    protected relationalFind(previousQueryResult: QueryResult<T>)
    {
        let query = Relation.queryOfModel(this.memberB.tableName);
        query = query.hasSome(this.previous.memberB.asFk(), previousQueryResult.toPks().toArray());
        return query;
    }

    async create(model: AbstractModel<T>): Promise<void>
    {
        let previousQueryResult = await this.previous.find();
        if(previousQueryResult.length > 1)
            return;

        // this b gets assigned to this a
        model[previousQueryResult.first().asFk()] = previousQueryResult.first().pk;

        // previous b looses his connection to this a
        let previousB = AbstractModel.get();

    }

    async relationalSave(model: AbstractModel<T>): Promise<void>
    {
        this.previousQueryElementOfThisModel().relationalSave(model);
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

export default ZeroOrOneToOne;