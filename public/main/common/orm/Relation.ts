import AbstractModel from "./AbstractModel";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import WixDatabase, { Query } from "./WixDatabase";
import { AnyNumber } from "../util/supportive";


abstract class Relation<A extends AbstractModel<A>, B extends AbstractModel<B>>
{
    _relativeA: new () => A;
    _relativeB: new () => B;
    _aAsPropertyNameForB: string;

    constructor (relativeA: new () => A, relativeB: new () => B, aAsPropertyNameForB: string)
    {
        this.relativeA = relativeA;
        this.relativeB = relativeB;
        this.aAsPropertyNameForB = aAsPropertyNameForB;
    }

    abstract inverse(): Relation<B, A>;

    /**
     * Assign Bs to relatives of type A and reverse if they are linked. 
     * @param {AnyNumber<B>} bs The Bs that will be assigned to As.
     * @param {AnyNumber<A>} as The As the Bs will be assigned to.
     */
    abstract async assign(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void>;

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
     * @param {new()=> U, U extends AbstractModel<U>} Model The model of the query.
     * @returns {Query<U>} A query. 
     */
    customQuery<U extends AbstractModel<U>>(Model: new () => U): Query<U>
    {
        return WixDatabase.query(Model);
    }

    bAsFkForA(): string
    {
        return this.inverse().aAsFkForB();
    }

    aAsFkForB(): string
    {
        return this.aAsPropertyNameForB.charAt(0).toLowerCase() + this.aAsPropertyNameForB.slice(1) + "Id";
    }

    queryOfRelativeA(): Query<A>
    {
        return WixDatabase.query(this.relativeA);
    }

    queryOfRelativeB(): Query<B>
    {
        return WixDatabase.query(this.relativeB);
    }

    /**
     * Get the name of B as property for A.
     * @returns {string} The name.
     */
    get bAsPropertyNameForA(): string
    {
        return this.inverse().aAsPropertyNameForB;
    }


    /**
     * Get the name of A as property for B.
     * @returns {string} The name.
     */
    get aAsPropertyNameForB(): string
    {
        return this._aAsPropertyNameForB;
    }

    /**
     * Set the name of A as property for B.
     * @param {string} aAsPropertyNameForB The name of a as a property for b.
     */
    set aAsPropertyNameForB(aAsPropertyNameForB: string)
    {
        this._aAsPropertyNameForB = aAsPropertyNameForB;
    }

    set relativeA(relative: new () => A)
    {
        this._relativeA = relative;
    }

    get relativeA(): new () => A
    {
        return this._relativeA;
    }

    set relativeB(relative: new () => B)
    {
        this._relativeB = relative;
    }

    get relativeB(): new () => B
    {
        return this._relativeB;
    }
}

export default Relation;