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

    protected buildQuery(previousQueryResult: QueryResult<T>) 
    {
        let intermediateQueryElement = new OneToMany<RoleModel>(new RoleModel(this.model, this.previous.model), this.previous);
        this.previous = intermediateQueryElement;

        let query = QueryElement.queryOnTable(this.model.tableName);
        let prevFks: Set<string> = new Set<string>();
        previousQueryResult.all().foreach((entity) => {prevFks.add(entity[this.model.asFk()]);});
        query = query.hasSome(this.model.asPk(), prevFks.toArray());
        return query;
    }

    async save(b: AbstractModel<T>): Promise<void> 
    {
        this.updateRoleTable(b);
        await this.previousQueryElementOfThisModel().save(b);
    }

    private async updateRoleTable(b :List<AbstractModel<T>>|AbstractModel<T>)
    {
        if(b instanceof AbstractModel)
            b.
        let bs = await this.resolve();

        if(bs.items.has(b))
            return;

        let as = await this.previous.previous.resolve();

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
        let previousQueryResult = await this.previous.resolve();
        await this.previous.destroyMany(previousQueryResult);
    }
}

export default ManyToMany;