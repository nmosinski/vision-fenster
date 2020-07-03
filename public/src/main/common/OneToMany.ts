import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";


class OneToMany<T extends AbstractModel<T>> extends QueryElement<T>
{
    constructor(model: T, previous: QueryElement<AbstractModel<any>>=null)
    {
        super(model, previous);
    }

    protected async relationalFind(previousQueryResult: QueryResult<T>): Promise<Array<object>>
    {
        let query = QueryElement.queryOnTable(this.model.tableName);
        query = query.hasSome(this.previous.model.asFk(), previousQueryResult.toPks().toArray());
        
        let wixQueryResult = await query.find();
        return wixQueryResult.items;
    }

    relationalSave(model: AbstractModel<T>): Promise<void> 
    {
        model.pk = this.rootQueryElement().model.pk;
        this.previousQueryElementOfThisModel().relationalSave(model);
    }
    update(model: AbstractModel<T>): Promise<void> 
    {
        model.pk = this.rootQueryElement().model.pk;
        this.previousQueryElementOfThisModel().update(model);
    }
    destroy(model: AbstractModel<T>): Promise<void>
    {
        model.pk = this.rootQueryElement().model.pk;
        this.previousQueryElementOfThisModel().destroy(model);
    }
}

export default OneToMany;