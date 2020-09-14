
import TestShoppingCart from "./TestShoppingCart";
import AbstractModel from "../../../../../../main/common/orm/AbstractModel";
import TestTag from "./TestTag";
import List from "../../../../../../main/common/util/collections/list/List";
import QueryResult from "../../../../../../main/common/orm/QueryResult";


class TestShoppingCartItem extends AbstractModel<TestShoppingCartItem>
{
    protected modelName: string;
    private _count: number;
    private _price: number;

    protected Constructor: new () => TestShoppingCartItem;
    private _testShoppingCart: TestShoppingCart;
    private _testTags: QueryResult<TestTag>;

    init(): void {
        this.Constructor = TestShoppingCartItem;
        this.modelName = 'TestShoppingCartItem';
    }

    addProperties(): void {
        this.properties.
            number("count", "positive", 'nullable').
            number("price", "positive", 'nullable');
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

    get count() {
        return this._count;
    }

    set testShoppingCart(testShoppingCart: TestShoppingCart) {
        this._testShoppingCart = testShoppingCart;
    }

    get testShoppingCart() {
        return this._testShoppingCart;
    }

    set testTags(testTags: QueryResult<TestTag>) {
        this._testTags = testTags;
    }

    get testTags(): QueryResult<TestTag> {
        return this._testTags;
    }

    set price(price: number) {
        this._price = price;
    }

    get price(): number {
        return this._price;
    }

}

export default TestShoppingCartItem;