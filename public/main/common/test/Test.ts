import JsTypes from "../util/jsTypes/JsTypes";
import List from "../util/collections/list/List";

abstract class TestExpected
{
    abstract eval(result: any): boolean;
    abstract toString(): string;
}

function value(value: any): Value
{
    return new Value(value);
}

class Value extends TestExpected
{
    private _value: any;
    
    constructor(value: any)
    {
        super();
        this.value = value;
    }

    eval(result: any): boolean
    {
        return result === this.value;
    }

    toString(): string
    {
        return "Value = " + JSON.stringify(this.value);
    }

    set value(value: any)
    {
        this._value = value;
    }

    get value(): any
    {
        return this._value;
    }
}

function truthly(): Truthly
{
    return new Truthly();
}

class Truthly extends TestExpected
{
    eval(result: any): boolean
    {
        if(!result)
            return false;
        return true;
    }

    toString(): string
    {
        return "Truthly";
    }
}

function unspecified(): Unspecified
{
    return new Unspecified();
}

class Unspecified extends TestExpected
{
    eval(result: any): boolean
    {
        if(!JsTypes.isUnspecified(result))
            return false;
        return true;
    }

    toString(): string
    {
        return "Unspecified (null or undefined)";
    }
}

/**
 * Class for printing test reports properly.
 * @param {string} location Location, the location of where the test comes from.
 * @param {string} description string, helpful description to understand the test and it's reason.
 * @param {TestExpected} expected Object, the expected result of the test.
 * @param {Function} implementation The implementation of the test.
 */
function test(location: string, description: string, expected: TestExpected, implementation: Function): Test
{
    return new Test(location, description, expected, implementation);
}

class Test
{
    private _expected: TestExpected;
    private _implementation: Function;
    private _location: string;
    private _description: string;
    private _passed: boolean;
    private _result: any;
    private _evaluated: boolean;
    private _error: any;
    
    /**
     * Class for printing test reports properly.
     * @param {string} location Location, the location of where the test comes from.
     * @param {string} description string, helpful description to understand the test and it's reason.
     * @param {TestExpected} expected Object, the expected result of the test.
     * @param {Function} implementation The implementation of the test.
     */
    constructor(location: string, description: string, expected: TestExpected, implementation: Function)
    {
        this.implementation = implementation;
        this.expected = expected;
        this.location = location;
        this.description = description;
        this.evaluated = false;
        this.passed = false;
        this.error = null;
    }

    print()
    {
        if(this.passed)
            console.log("%c" + this.location + " , " + this.description + ": PASSED", "background: #FFF; color: #1fad1f");
        else
            console.log("%c" + this.location + " , " + this.description + ": FAILED\n" + "Expected " + this.expected.toString() + " but resulted in " + this.result + "\n", "background: #FFF; color: #ff8c00");
        if(this.error)
        {
            console.log("%c" + "The following error has been thrown when executing the upper test:", "background: #FFF; color: #ff0000");
            console.log("%c" + this.error, "background: #FFF; color: #ff0000");
            console.log(this.error);
        }
    }

    async run()
    {
        try
        {
            this.result = await this.implementation();
        }catch(err)
        {
            this.error = err;
        }
        this.passed = this.expected.eval(this.result);
        this.evaluated = true;
    }

    /**
     * Set location.
     * @param {string} location The location of the test.
     */
    set location(location: string)
    {
        this._location = location;
    }

    /**
     * Get location.
     * @returns {string} The location.
     */
    get location(): string
    {
        return this._location;
    }

    /**
     * Set passed property.
     * @param {boolean} passed The passed property.
     */
    set passed(passed: boolean)
    {
        this._passed = passed;
    }

     /**
     * Check if test passed.
     * @returns {boolean} True if passed, else false.
     */
    get passed(): boolean
    {
        return this._passed;
    }

    /**
     * Set the implementation of the test.
     * @param {Function} passed The implementation of the test.
     */
    set implementation(implementation: Function)
    {
        this._implementation = implementation;
    }

    /**
     * Get the implementation of the test.
     * @returns {Function} The implementation.
     */
    get implementation(): Function
    {
        return this._implementation;
    }

    /**
     * Set description for this test.
     * @param {string} description A description.
     */
    set description(description: string)
    {
        this._description = description;
    }

    /**
     * Get the information if the test has been evaluated already.
     * @returns {boolean} true if yes, else no.
     */
    get evaluated(): boolean
    {
        return this._evaluated;
    }

    /**
     * Set the information if the test has been evaluated already.
     * @param {boolean} evaluated True if evaluated, else false.
     */
    set evaluated(evaluated: boolean)
    {
        this._evaluated = evaluated;
    }

    /**
     * Get description for this test.
     * @returns {string} The description.
     */
    get description(): string
    {
        return this._description;
    }

    /**
     * Set what's expected from the test.
     * @param {TestExpected} expected What's expected from the test.
     */
    set expected(expected: TestExpected)
    {
        this._expected = expected;
    }

    /**
     * Get what's expected from the test.
     * @returns {TestExpected} What's expected from the test.
     */
    get expected(): TestExpected
    {
        return this._expected;
    }

    /**
     * Set the result of the test.
     * @param {any} result The result.
     */
    set result(result: any)
    {
        this._result = result;
    }

    /**
     * Get the result of the test.
     * @returns {any} The result.
     */
    get result(): any
    {
        return this._result;
    }

    /**
     * Set the error if occurred during the test execution.
     * @param {any} error The error.
     */
    set error(error)
    {
        this._error = error;
    }

    /**
     * Get the error if occurred during the test execution.
     * @returns {any} The error.
     */
    get error()
    {
        return this._error;
    }
}

class Tests extends List<Test>
{
    private _beforeEach: Function;
    private _afterEach: Function;
    private _afterAll: Function;
    private _beforeAll: Function;
    /**
     * @param {Function} [beforeAll] The function to be run before all tests.
     * @param {Function} [afterAll] The function to be run after all tests.
     * @param {Function} [beforeEach] The function to be run before each test.
     * @param {Function} [afterEach] The function to be run after each test.
     */
    constructor(beforeAll: Function=null, afterAll: Function=null, beforeEach: Function=null, afterEach: Function=null)
    {
        super();
        this.beforeAll = beforeAll;
        this.afterAll = afterAll;
        this.beforeEach = beforeEach;
        this.afterEach = afterEach;
    }

    async runAll(): Promise<void>
    {
        await this.beforeAll();
        for(let idx = 0; idx < this.length; idx++)
        {
            let test = this.get(idx);
            await this.beforeEach();
            await test.run();
            test.print();
            await this.afterEach();
        }

        await this.afterAll();
    }

    /**
     * @param {Function} beforeAll
     */
    set beforeAll(beforeAll: Function)
    {
        if(typeof(beforeAll) === "function")
            this._beforeAll = beforeAll;
        else
            this._beforeAll = ()=>{};
    }

    /**
     * @param {Function} afterAll
     */
    set afterAll(afterAll: Function)
    {
        if(typeof(afterAll) === "function")
            this._afterAll = afterAll;
        else
            this._afterAll = ()=>{};
    }

    /**
     * @param {Function} beforeEach
     */
    set beforeEach(beforeEach: Function)
    {
        if(typeof(beforeEach) === "function")
            this._beforeEach = beforeEach;
        else
            this._beforeEach = ()=>{};
    }

    /**
     * @param {Function} afterEach
     */
    set afterEach(afterEach: Function)
    {
        if(typeof(afterEach) === "function")
            this._afterEach = afterEach;
        else
            this._afterEach = ()=>{};
    }

    /**
     * @returns {Function}
     */
    get beforeAll(): Function
    {
        return this._beforeAll;
    }

    /**
     * @returns {Function}
     */
    get afterAll(): Function
    {
        return this._afterAll;
    }

    /**
     * @returns {Function}
     */
    get beforeEach(): Function
    {
        return this._beforeEach;
    }

    /**
     * @returns {Function}
     */
    get afterEach(): Function
    {
        return this._afterEach;
    }
}

export {Tests, Test, Truthly, Unspecified, Value, test, truthly, unspecified, value};