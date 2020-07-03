import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import QueryResult from "./QueryResult";
import OneToMany from "./OneToMany";
import Set from "public/src/main/common/util/collections/set/Set.js"
import RoleModel from "./RoleModel";
import List from "./util/collections/list/List";

class ManyToMany<T extends AbstractModel<T>> extends QueryElement<T>
{
    constructor(model: T, previous: QueryElement<AbstractModel<any>>=null)
    {
        super(model, previous);
    }

    protected async relationalFind(previousQueryResult: QueryResult<T>): Promise<Array<object>>
    {
        // Create a dummy QueryElement that will return previousQueryResult (a) when calling find().
        let dummyQueryElement = new ManyToMany(this.model, null);
        dummyQueryElement.queryResult = previousQueryResult;

        // Create an intermediate QueryElement that simulates the relation between a and the role table a_b. Call it's find() method in order to get a_bs.
        let intermediateQueryElement = new OneToMany<RoleModel>(new RoleModel(this.model, this.previous.model), dummyQueryElement);
        let intermediateQueryResult = await intermediateQueryElement.find();

        let query = QueryElement.queryOnTable(this.model.tableName);
        let prevFks: Set<string> = new Set<string>();
        intermediateQueryResult.all().foreach((ab) => {prevFks.add(ab[this.model.asFk()]);});
        query = query.hasSome(this.model.asPk(), prevFks.toArray());
        
        let wixQueryResult = await query.find();
        return wixQueryResult.items;
    }

    async relationalSave(b: AbstractModel<T>): Promise<void> 
    {
        this.updateRoleTable(b);
        await this.previousQueryElementOfThisModel().relationalSave(b);
    }

    private async updateRoleTable(b :List<AbstractModel<T>>|AbstractModel<T>)
    {
        if(b instanceof AbstractModel)
            b.
        let bs = await this.find();

        if(bs.items.has(b))
            return;

        let as = await this.previous.previous.find();

        let toSave = new List<RoleModel>();
        as.items.foreach((a)=>{toSave.add(new RoleModel(a, b));});
        await this.previous.saveMany(toSave);
    }

    async update(b: AbstractModel<T>): Promise<void> 
    {
        this.updateRoleTable(b);
        await this.previousQueryElementOfThisModel().update(b);
    }

    async destroy(model: AbstractModel<T>): Promise<void> 
    {
        let previousQueryResult = await this.previous.find();
        await this.previous.destroyMany(previousQueryResult);
    }
}

export default ManyToMany;