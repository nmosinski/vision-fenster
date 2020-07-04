import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import wixData from "wix-data";
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";
import Root from "./Root";

class OneToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends QueryElement<A,B>
{   
    constructor(modelA: A, modelB: B, previous: QueryElement<AbstractModel<any>, A>=null)
    {
        super(modelA, modelB, previous);
    }

    protected async relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>>
    {
        let query = this.queryOfMemberB();
        query = query.hasSome(this.previous.memberB.asFk(), previousQueryResult.toPks());
        
        return await query.find();
    }

    /*
    async relationalSave(model: AbstractModel<T>): Promise<void> 
    {
        /*
        let previousQueryResult = await this.previous.resolve();
        
        previousQueryResult.all().foreach((prevModel) => {prevModel[model.asFk()] = model.id;});
        this.previous.saveMany(previousQueryResult.all());

        

        await AbstractModel.save(model);
        
    }
    */

    /*
    async update(model: AbstractModel<T>): Promise<void> 
    {
        throw new Error("Method not implemented.");
    }

    async destroy(model: AbstractModel<T>): Promise<void> 
    {
        throw new Error("Method not implemented.");
    }
    */
}

export default OneToOne;