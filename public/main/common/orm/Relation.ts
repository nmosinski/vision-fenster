import AbstractModel from "./AbstractModel";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import WixDatabase, { Query } from "./WixDatabase";


abstract class Relation<A extends AbstractModel<A>, B extends AbstractModel<B>>
{
    _relativeA: new () => A;
    _relativeB: new () => B;

    constructor(relativeA: new () => A, relativeB: new () => B) {
        this.relativeA = relativeA;
        this.relativeB = relativeB;
    }

    abstract inverse(): Relation<B, A>;

    /**
     * Assign a B to a relative of type A. 
     * @param {B} toBeAssigned The B that will be assigned to A.
     * @param {A} relative The relative the B will be assigned to.
     * @returns {B} The B.
     */
    abstract assign(toBeAssigned: B, relative: A): B;

    /**
     * Assign multiple Bs to a relative of type A. 
     * @param {List<B>} toBeAssigned The Bs that will be assigned to A.
     * @param {A} relative The relative the B will be assigned to.
     * @returns {List<B>} The Bs.
     */
    abstract assignMultiple(toBeAssigned: List<B>, relative: A): List<B>;

    /**
     * Get a B that belongs to the given relative of type A.
     * @param {List<A>}  [relative] The relative.
     * @returns {Promise<B>} B of the given id. 
     */
    async abstract relationalGet(relative: A): Promise<B>;

    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when storing the given B.
     * @param {B} toCreate The B to be created. 
     * @param {List<A>} [relatives] The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalCreate(toCreate: B, relatives?: List<A>): Promise<void>;

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
     * Get the name of B as property for A.
     * @returns {string} The name.
     */
    abstract bAsPropertyNameForA(): string;

    /**
     * Get the name of A as property for B.
     * @returns {string} The name.
     */
    aAsPropertyNameForB(): string {
        return this.inverse().bAsPropertyNameForA();
    }

    /**
     * Find all realtives of type B that belong to any of the given relatives of type A and assign the relatives of type A to the relatives of type B.
     * @param {List<A>} relatives The list containing relatives of type A.
     * @returns {Promise<QueryResult<B>>} A list contining all As related to the given As. 
     */
    async abstract relationalLoad(relatives: List<A>): Promise<QueryResult<B>>;

    /**
     * Get all Bs that belong to at least one of the given relatives of type A.
     * @param {List<A>}  [relatives] The relatives. If not given, the method will consider all existing A's.
     * @returns {Promise<List<B>>} Bs that belong to the given relatives.
     */
    async abstract relationalFind(relatives?: List<A>): Promise<QueryResult<B>>;

    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when storing the given B's.
     * @param {List<B>} toSave The Bs to be created. 
     * @param {List<A>} relatives The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalCreateMultiple(toSave: List<B>, relatives?: List<A>): Promise<void>;

    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when saving the given B's.
     * @param {List<B>} toSave The Bs to be created. 
     * @param {List<A>} relatives The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalSaveMultiple(toSave: List<B>, relatives?: List<A>): Promise<void>;

    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when updating the given B's.
     * @param {List<B>} toUpdate The Bs to be updated. 
     * @param {List<A>} relatives The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalUpdateMultiple(toUpdate: List<B>, relatives?: List<A>): Promise<void>;

    /**
     * Perform all necessary operations on all given relatives of type A that need to be done when destroying the given B's.
     * @param {List<B>} toDestroy The Bs to be destroyed. 
     * @param {List<A>} relatives The relatives on which the needed operations will be performed. If not given, the operations will be performed on all existing A's.
     */
    async abstract relationalDestroyMultiple(toDestroy: List<B>, relatives?: List<A>): Promise<void>;

    customQuery<U extends AbstractModel<U>>(Model: new () => U): Query<U> {
        return WixDatabase.query(Model);
    }

    queryOfRelativeA(): Query<A> {
        return WixDatabase.query(this.relativeA);
    }

    queryOfRelativeB(): Query<B> {
        return WixDatabase.query(this.relativeB);
    }

    get relativeA(): new () => A {
        return this._relativeA;
    }

    get relativeB(): new () => B {
        return this._relativeB;
    }

    set relativeA(relative: new () => A) {
        this._relativeA = relative;
    }

    set relativeB(relative: new () => B) {
        this._relativeB = relative;
    }
}

export default Relation;