import Relation from "public/main/common/Relation.js"
import AbstractModel from "public/main/common/AbstractModel.js"
import QueryResult from "public/main/common/QueryResult.js";
import OneToMany from "public/main/common/OneToMany.js";
import List from "public/main/common/util/collections/list/List.js";
import ManyToOne from "public/main/common/ManyToOne.js";

class ManyToMany<A extends AbstractModel<A>, B extends AbstractModel<B>, C extends AbstractModel<C>> extends Relation<A,B>
{
    private _roleModel: new()=>C;

    constructor(relativeA: new()=>A, relativeB: new()=>B, roleModel: new()=>C)
    {
        super(relativeA, relativeB);
        this.roleModel = roleModel;
    }

    async relationalGet(previousQueryResult: QueryResult<A>): Promise<B> 
    {
        throw new Error("Method not implemented.");
    }
    async relationalSave(toSave: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalUpdate(toUpdate: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalDestroy(toDestroy: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * @todo
     */
    async relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>>
    {
        throw new Error("Method not implemented.");
        // Split find in OneToMany<A,A_B> and ManyToOne<A_B,B>
        let aOneToManyAbRelation = new OneToMany(this.relativeA, this.roleModel);
        let aOneToManyAbQueryResult = await aOneToManyAbRelation.relationalFind(previousQueryResult);

        let abManyToOneBRelation = new ManyToOne(this.roleModel, this.relativeB);
        let abManyToOneBQueryResult = await abManyToOneBRelation.relationalFind(aOneToManyAbQueryResult);
        
        return abManyToOneBQueryResult;
    }

    async relationalSaveMultiple(toSave: List<B>, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalUpdateMultiple(toUpdate: List<B>, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalDestroyMultiple(toDestroy: List<B>, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    set roleModel(roleModel: new()=>C)
    {
        this._roleModel = roleModel;
    }

    get roleModel(): new()=>C
    {
        return this._roleModel;
    }
}

export default ManyToMany;