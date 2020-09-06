
import TestShoppingCart from "./TestShoppingCart";
import AbstractModel from "../../../../../../main/common/orm/AbstractModel";
import TestTag from "./TestTag";
import List from "../../../../../../main/common/util/collections/list/List";
import QueryResult from "../../../../../../main/common/orm/QueryResult";


class TestShoppingCartItem extends AbstractModel<TestShoppingCartItem>
{
    private _count: any;

    protected Constructor: new () => TestShoppingCartItem;
    private _testShoppingCart: TestShoppingCart;
    private _testTags: QueryResult<TestTag>;

    init(): void {
        this.Constructor = TestShoppingCartItem;
    }

    addProperties(): void {
        this.properties.
            number("count", "positive").
            number("price", "positive");
    }

    addRelations(): void {
        this.manyToOne(TestShoppingCart);
        this.manyToMany(TestTag);
    }

    testShoppingCartQ() {
        return this.relative(TestShoppingCart);
    }

    testTagsQ() {
        return this.relative(TestTag);
    }

    set count(count) {
        this._count = count;
    }

    set testShoppingCart(testShoppingCart: TestShoppingCart) {
        this._testShoppingCart = testShoppingCart;
    }

    set testTags(testTags: QueryResult<TestTag>) {
        this._testTags = testTags;
    }

    get count() {
        return this._count;
    }

    get testShoppingCart() {
        return this._testShoppingCart;
    }

    get testTags(): QueryResult<TestTag> {
        return this._testTags;
    }



}

export default TestShoppingCartItem;