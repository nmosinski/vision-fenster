import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import Set from "./util/collections/set/Set.js";
import OneToOne from "./OneToOne";
import QueryResult from "./QueryResult";


class ManyToOne<T extends AbstractModel<T>> extends QueryElement<T>
{
    constructor(model: T, previous: QueryElement<AbstractModel<any>>=null)
    {
        super(model, previous);
    }

    protected async relationalFind(previousQueryResult: QueryResult<AbstractModel<any>>): Promise<Array<object>> 
    {
        let query = QueryElement.queryOnTable(this.model.tableName);
        let prevFks: Set<string> = new Set<string>();
        previousQueryResult.all().foreach((entity) => {prevFks.add(entity[this.model.asFk()]);});
        query = query.hasSome(this.model.asPk(), prevFks.toArray());
        
        let wixQueryResult = await query.find();
        return wixQueryResult.items;
    }

    save(model: AbstractModel<T>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(model: AbstractModel<T>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    destroy(model: AbstractModel<T>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default ManyToOne;