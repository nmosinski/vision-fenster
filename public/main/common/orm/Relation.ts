import QueryResult from "./QueryResult";
import { AnyNumber } from "../util/supportive";
import AbstractStorableModel from "./AbstractStorableModel";
import IQueryDriver from "../persistance/model/IQueryDriver";


abstract class Relation<A extends AbstractStorableModel<A>, B extends AbstractStorableModel<B>>
{
    _relativeA: new () => A;
    _relativeB: new () => B;

    constructor (relativeA: new () => A, relativeB: new () => B)
    {
        this.relativeA = relativeA;
        this.relativeB = relativeB;
    }

    abstract inverse(): Relation<B, A>;

    /**
     * Assign Bs to relatives of type A and reverse if they are linked. 
     * @param {AnyNumber<B>} bs The Bs that will be assigned to As.
     * @param {AnyNumber<A>} as The As the Bs will be assigned to.
     */
    async abstract assign(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void>;

    /**
     * Link Bs to relatives of type A and reverse.
     * @param {AnyNumber<B>} bs The Bs that will be linked to As.
     * @param {AnyNumber<A>} as The As the Bs will be linked to.
     */
    abstract async link(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void>;

    /**
     * Get a B that belongs to the given relative of type A.
     * @param {A}  [relative] The relative.
     * @returns {Promise<B>} B of the given id. 
     */
    async abstract relationalGet(relative: A): Promise<B | never>;

    /**
     * Destroy all Bs that belong to the given As.
     * @param {AnyNumber<A>} relatives The as.
     */
    async abstract relationalDestroy(relatives: AnyNumber<A>): Promise<void>;

    /**
     * Get all Bs that belong to at least one of the given relatives of type A.
     * @param {AnyNumber<A>}  [relatives] The relatives.
     * @returns {Promise<QueryResult<B>>} Bs that belong to the given relatives.
     */
    async abstract relationalFind(relatives: AnyNumber<A>): Promise<QueryResult<B>>;

    /**
     * Get a custom query.
     * @param {new()=> U, U extends AbstractStorableModel<U>} Model The model of the query.
     * @returns {Query<U>} A query. 
     */
    customQuery<U extends AbstractStorableModel<U>>(Model: new () => U): IQueryDriver
    {
        const model = new Model();
        return model.storageDriver.query(model.tableName);
    }

    /**
     * Get the name of B as property for A.
     * @returns {string} The name.
     */
    abstract bAsPropertyNameForA(): string;

    /**
     * Get the name of A as property for B.
     * @returns {string} The name.
     */
    aAsPropertyNameForB(): string
    {
        return this.inverse().bAsPropertyNameForA();
    }

    queryOfRelativeA(): IQueryDriver
    {
        const model = new this.relativeA();
        return model.storage.query(model.tableName);
    }

    queryOfRelativeB(): IQueryDriver
    {
        const model = new this.relativeB();
        return model.storage.query(model.tableName);
    }

    set relativeA(relative: new (data?: object) => A)
    {
        this._relativeA = relative;
    }

    get relativeA(): new (data?: object) => A
    {
        return this._relativeA;
    }

    set relativeB(relative: new (data?: object) => B)
    {
        this._relativeB = relative;
    }

    get relativeB(): new (data?: object) => B
    {
        return this._relativeB;
    }
}

export default Relation;