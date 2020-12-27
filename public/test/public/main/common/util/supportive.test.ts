/* eslint-disable */
import { Tests, Test, truthly } from "../../../../../main/common/test/Test";
import { areEqual } from "../../../../../main/common/util/supportive";

const PATH = 'public/test/public/main/extern/wix/common/persistance/WixDatabase.test';

export async function runAllTests()
{
    const tests = new Tests(undefined, undefined, undefined, undefined);

    tests.add(new Test(PATH, "areEqual function considers two equal entities of primitive types as equal", truthly(), areEqual1));
    tests.add(new Test(PATH, "areEqual function considers two different entities of primitive types as not equal", truthly(), areEqual2));
    tests.add(new Test(PATH, "areEqual function considers two similar entities of different types as not equal", truthly(), areEqual3));
    tests.add(new Test(PATH, "areEqual function considers two equal objects as equal", truthly(), areEqual4));
    tests.add(new Test(PATH, "areEqual function considers two different objects as not equal", truthly(), areEqual5));
    tests.add(new Test(PATH, "areEqual function considers two objects with same properties and different classes as equal without the class parameter", truthly(), areEqual6));
    tests.add(new Test(PATH, "areEqual function considers two objects with same properties and different classes as not equal with the class parameter", truthly(), areEqual7));
    tests.add(new Test(PATH, "areEqual function considers two JSON objects with same properties as not equal with the class parameter", truthly(), areEqual8));
    tests.add(new Test(PATH, "areEqual function respects the equal method if passed objects", truthly(), areEqual9));
    tests.add(new Test(PATH, "areEqual function considers two equal nested objects as equal", truthly(), areEqual10));
    tests.add(new Test(PATH, "areEqual function considers two not equal nested objects as not equal", truthly(), areEqual11));

    tests.runAll();
}

function areEqual1()
{
    return areEqual('2', '2') === true;
}

function areEqual2()
{
    return areEqual('2', '3') === false;
}

function areEqual3()
{
    return areEqual('2', 2) === false;
}

function areEqual4()
{
    return areEqual({ 'a': '1', 'b': '2' }, { 'a': '1', 'b': '2' }) === true;
}

function areEqual5()
{
    return areEqual({ 'a': '1', 'b': '3' }, { 'a': '1', 'b': '2' }) === false;
}

function areEqual6()
{
    return areEqual({ 'a': '1', 'b': '2' }, { 'a': '1', 'b': '2' }) === true;
}

function areEqual7()
{
    const a = new A();
    const b = new B();

    a.a = 'a';
    a.b = 'b';

    b.a = 'a';
    b.b = 'b';

    return areEqual(a, b, A) === false;
}

function areEqual8()
{
    const a = {};
    const b = {};

    // @ts-ignore
    a.a = 'a';
    // @ts-ignore
    a.b = 'b';

    // @ts-ignore
    b.a = 'a';
    // @ts-ignore
    b.b = 'b';

    return areEqual(a, b, A) === false;
}

function areEqual9()
{
    const c1 = new C();
    const c2 = new C();

    c1.a = 'a';
    c1.b = 'b';

    c2.a = 'a';
    c2.b = 'b';

    return areEqual(c1, c2, C) === false;
}

function areEqual10()
{
    const a1 = new A();
    const a2 = new A();

    a1.a = new A();
    a1.a.a = 'a';
    a1.b = 'b';

    a2.a = new C();
    a2.a.a = 'a';
    a2.b = 'b';

    return areEqual(a1, a2, A) === true;
}

function areEqual11()
{
    const a1 = new A();
    const a2 = new A();

    a1.a = new A();
    a1.a.a = 'x';
    a1.b = 'b';

    a2.a = new C();
    a2.a.a = 'a';
    a2.b = 'b';

    return areEqual(a1, a2, A) === false;
}

class A
{
    public a;
    public b;
}

class B
{
    public a;
    public b;
}

class C
{
    public a;
    public b;

    equals(o)
    {
        return false;
    }
}