import Relation from "public/src/main/common/Relation.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import QueryResult from "./QueryResult";
import OneToMany from "./OneToMany";
import RoleModel from "./RoleModel";
import ManyToOne from "./ManyToOne";
import List from "./util/collections/list/List";

class ManyToMany<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{
    constructor(relativeA: A, relativeB: B)
    {
        super(relativeA, relativeB);
    }

    relationalGet(previousQueryResult: QueryResult<A>): Promise<B> 
    {
        throw new Error("Method not implemented.");
    }
    relationalSave(toSave: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalUpdate(toUpdate: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalDestroy(toDestroy: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }


    async relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>>
    {
        // Split find in OneToMany<A,A_B> and ManyToOne<A_B,B>
        let roleModel = new RoleModel(this.relativeA, this.relativeB);
        let aOneToManyAbRelation = new OneToMany(this.relativeA, roleModel);
        let aOneToManyAbQueryResult = await aOneToManyAbRelation.relationalFind(previousQueryResult);

        let abManyToOneBRelation = new ManyToOne(roleModel, this.relativeB);
        let abManyToOneBQueryResult = await abManyToOneBRelation.relationalFind(aOneToManyAbQueryResult);
        
        return abManyToOneBQueryResult;
    }

    relationalSaveMultiple(toSave: List<B>, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalUpdateMultiple(toUpdate: List<B>, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalDestroyMultiple(toDestroy: List<B>, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default ManyToMany;