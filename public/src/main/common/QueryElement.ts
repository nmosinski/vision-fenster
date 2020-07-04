import AbstractModel from "public/src/main/common/AbstractModel.js"
import wixData from "wix-data";
import AbstractEntity from "./AbstractEntity";
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";
import Root from "./Root";
import JsTypes from "./util/jsTypes/JsTypes";
import Query from "./Query";


abstract class QueryElement<A extends AbstractModel<A>, B extends AbstractModel<B>>
{
    _previous: QueryElement<AbstractModel<any>, A>;
    _memberA: A;
    _memberB: B;
    _queryResult: QueryResult<B>;
    
    constructor(memberA: A, memberB: B, previous: QueryElement<AbstractModel<any>, A>=null)
    {
        this.memberA = memberA;
        this.memberB = memberB;
        this.previous = previous;
        this.queryResult = null;
    }

    protected async abstract relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>>;
    //async abstract relationalSave(toSave: List<AbstractModel<B>>, previousQueryResult: QueryResult<A>): Promise<List<B>>;
    //async abstract relationalUpdate(toUpdate: List<AbstractModel<B>>, previousQueryResult: QueryResult<A>): Promise<List<B>>;
    async abstract relationalDestroy(toDestroy: B): Promise<void>;

    async find(): Promise<QueryResult<B>>
    {
        // Return result if already resolved before.
        if(this.queryResult)
            return this.queryResult;
  
        // Init this and previous QueryResult.
        this.queryResult = new QueryResult<B>();
        let previousQueryResult = (this.previous)?await this.previous.find():new QueryResult<A>();


        let queryResult = await this.relationalFind(previousQueryResult);

        return this.queryResult;
    }

    async destroy(toDestroy: B): Promise<void>
    {
        this.relationalDestroy(toDestroy);
    }

    /*
    async saveMany(toSave: List<B>): Promise<void>
    {
        /*
        let previousQueryResult = await this.previous.find();
        let toUpdate = await this.relationalSave(toSave, previousQueryResult);

        await this.previous.updateMany(toUpdate);
        await this.previousQueryElementOfThisModel().saveMany(toSave);
        
    }
    */

    /*
    async updateMany(toUpdate: List<B>): Promise<void>
    {
        let previousQueryResult = (this.previous)?await this.previous.find():new QueryResult<A>();
        
        if(previousQueryResult.length === 1)
            this.assignToMany(previousQueryResult.first(), toUpdate);
        
        // update the given objects considering the relation to previous. Means, update the fks in this objects in necessary.
        // Call root?


        // Is pretended to be executed only if the list of items should be assigned to the previous query result.
        // Each model should hold all of his relations. Update/ UpdateMany should always consider all relations, going on recursive.
        // Update ids in toUpdate-Models. Update ids in models retrieved by this find-query if necessary. Call toUpdate for previous.
        
        let previousQueryResult = await this.previous.find();
        let toUpdate = await this.relationalUpdate(toUpdate, previousQueryResult);

        await this.previous.updateMany(toUpdate);
        await this.previousQueryElementOfThisModel().saveMany(toSave);
        
    }
    */

    /**
     * Assign objects to subjects.
     * @param {List<U>} objects A lsit containing the models that will be assigned to the subjects. 
     * @param {List<T>} subjects A list containing the models the objects will be assigned to.
     */
    assignToMany(object: A, subjects: List<B>): List<B>
    {   
        subjects.foreach((subject)=>{subject[object.asFk()] = object.id;});
        return subjects;
    }

    previousQueryElementOfThisModel(): QueryElement<any, B>
    {
        let previous = this.previous;
        while(previous)
        {
            if(JsTypes.belongToTheSameClass(this.memberB, previous.memberB))
                return previous; // @ignore - No possibility of checking generic types. 
            previous = previous.previous;
        }

        return null;
    }

    rootOfChain(): Root<any>
    {
        if(this instanceof Root)
            return this;
        else if(this.previous)
            return this.previous.rootOfChain();
        else
            return null;
    }

    firstOfChain(): QueryElement<any, any>
    {
        if(this.previous)
            return this.previous.firstOfChain();
        else
            return this;
    }


    queryOfMemberA(): Query<A>
    {
        return QueryElement.queryOfModel(this.memberA);
    }

    queryOfMemberB(): Query<B>
    {
        return QueryElement.queryOfModel(this.memberB);
    }

    static queryOfModel<U extends AbstractModel<U>>(model: U): Query<U>
    {
        return new Query(model);
    }

    get memberA(): A
    {
        return this._memberA;
    }

    get memberB(): B
    {
        return this._memberB;
    }

    get previous(): QueryElement<any, A>
    {
        return this._previous;
    }

    get queryResult(): QueryResult<B>
    {
        return this._queryResult;
    }

    set memberA(model: A)
    {
        this._memberA = model;
    }

    set memberB(model: B)
    {
        this._memberB = model;
    }

    set previous(previous: QueryElement<any, A>)
    {
        this._previous = previous;
    }

    set queryResult(queryResult: QueryResult<B>)
    {
        this._queryResult = queryResult;
    }
}

export default QueryElement;