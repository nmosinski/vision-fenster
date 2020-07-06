import AbstractModel from "public/main/common/AbstractModel.js"
import QueryResult from "public/main/common/QueryResult.js";
import {Query} from "public/main/common/WixDatabase.js"
import WixDatabase from "public/main/common/WixDatabase.js"
import List from "public/main/common/util/collections/list/List.js";

abstract class Relation<A extends AbstractModel<A>, B extends AbstractModel<B>>
{
    _relativeA: new()=>A;
    _relativeB: new()=>B;
    _queryResult: QueryResult<B>;
    
    constructor(relativeA: new()=>A, relativeB: new()=>B)
    {
        this.relativeA = relativeA;
        this.relativeB = relativeB;
        this.queryResult = null;
    }

    abstract inverse(): Relation<B,A>;

    /**
     * Assign a B to relatives of type A. 
     * @param {B} toBeAssigned The B that will be assigned to A.
     * @param {List<A>} relatives The relatives the B will be assigned to.
     * @returns {B} The B.
     */
    abstract assign(toBeAssigned: B, relatives: List<A>): B;
    
    /**
     * Assign multiple Bs to relatives of type A. 
     * @param {List<B>} toBeAssigned The Bs that will be assigned to A.
     * @param {List<A>} relatives The relatives the B will be assigned to.
     * @returns {List<B>} The Bs.
     */
    abstract assignMultiple(toBeAssigned: List<B>, relatives: List<A>): List<B>;



    /**
     * Get a B only if it belongs to at least one of the given relatives of type A.
     * @param {string} id The id of the B to be retrieved.
     * @param {List<A>}  [relatives] The previous query result containing the A's. If not given, the method will consider all existing A's.
     * @returns {Promise<B>} B of the given id. 
     */
    async abstract relationalGet(id: string, relatives?: List<A>): Promise<B>;
    
    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when saving the given B.
     * @param {B} toSave The B to be saved. 
     * @param {List<A>} [relatives] The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalSave(toSave: B, relatives?: List<A>): Promise<void>;
   
    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when updating the given B.
     * @param {B} toUpdate The B to be updated. 
     * @param {List<A>} relatives The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalUpdate(toUpdate: B, relatives?: List<A>): Promise<void>;
   
    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when destroying the given B.
     * @param {B} toDestroy The B to be destroyed. 
     * @param {List<A>} relatives The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalDestroy(toDestroy: B, relatives?: List<A>): Promise<void>;

    /**
     * Get all Bs that belong to at least one of the given relatives of type A.
     * @param {List<A>}  [relatives] The relatives. If not given, the method will consider all existing A's.
     * @returns {Promise<List<B>>} Bs that belong to the given relatives.
     */
    async abstract relationalFind(relatives?: List<A>): Promise<QueryResult<B>>;
    
    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when saving the given B's.
     * @param {List<B>} toSave The Bs to be destroyed. 
     * @param {List<A>} relatives The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalSaveMultiple(toSave: List<B>, relatives?: List<A>): Promise<void>;
    
    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when updating the given B's.
     * @param {List<B>} toUpdate The Bs to be destroyed. 
     * @param {List<A>} relatives The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalUpdateMultiple(toUpdate: List<B>, relatives?: List<A>): Promise<void>;
    
    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when destroying the given B's.
     * @param {List<B>} toDestroy The Bs to be destroyed. 
     * @param {List<A>} relatives The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalDestroyMultiple(toDestroy: List<B>, relatives?: List<A>): Promise<void>;

    queryOfRelativeA(): Query<A>
    {
        return WixDatabase.query(this.relativeA);
    }

    queryOfRelativeB(): Query<B>
    {
        return WixDatabase.query(this.relativeB);
    }

    get relativeA(): new()=>A
    {
        return this._relativeA;
    }

    get relativeB(): new()=>B
    {
        return this._relativeB;
    }

    get queryResult(): QueryResult<B>
    {
        return this._queryResult;
    }

    set relativeA(relative: new()=>A)
    {
        this._relativeA = relative;
    }

    set relativeB(relative: new()=>B)
    {
        this._relativeB = relative;
    }


    set queryResult(queryResult: QueryResult<B>)
    {
        this._queryResult = queryResult;
    }
}

export default Relation;