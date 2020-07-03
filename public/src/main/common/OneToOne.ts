import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import wixData from "wix-data";
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";
import Root from "./Root";

class OneToOne<T extends AbstractModel<T>> extends QueryElement<T>
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

    async relationalSave(model: AbstractModel<T>): Promise<void> 
    {
        /*
        let previousQueryResult = await this.previous.resolve();
        
        previousQueryResult.all().foreach((prevModel) => {prevModel[model.asFk()] = model.id;});
        this.previous.saveMany(previousQueryResult.all());

        

        await AbstractModel.save(model);
        */
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

export default OneToOne;