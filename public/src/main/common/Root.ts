import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";
import Product from "../feature/shoppingCart/model/Product";


class Root<B extends AbstractModel<B>> extends QueryElement<null, B>
{
    constructor(rootElement: B)
    {
        super(null, rootElement, null);
    }

    protected async relationalFind(previousQueryResult: QueryResult<null>): Promise<QueryResult<B>>
    {
        let queryResult = new QueryResult<B>();
        queryResult.add(this.memberB);
        return queryResult;
    }

    /*
    async relationalSave(model: AbstractModel<T>): Promise<void> 
    {   
        AbstractModel.save(model);
    }

    async update(model: AbstractModel<T>): Promise<void> 
    {   
        model.manyToOne.foreach((relation) => {relation.destroy(model);});
        model.manyToMany.foreach((relation) => {relation.destroy(model);});
        model.oneToOne.foreach((relation) => {relation.destroy(model);});
        //AbstractModel.update(model);
    }
    */
    /**
     * Destroy this model.
     * Associated models do not get saved/updated/destroyed except their references.
     */
    async destroy(model: AbstractModel<B>): Promise<void>
    {     

        //AbstractModel.destroy(model);
    }
}

export default Root;