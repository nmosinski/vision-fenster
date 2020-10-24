import { Tests, Test, truthly } from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
const PATH = "public/test/public/main/common/collections/List.test"

export async function runAllTests()
{
    const tests = new Tests();

    tests.add(new Test(PATH, "new List from object", truthly(), newListFromObject));
    tests.add(new Test(PATH, "new List from array", truthly(), newListFromArray));
    tests.add(new Test(PATH, "new List from List", truthly(), newListFromList));
    tests.add(new Test(PATH, "map", truthly(), map));
    tests.add(new Test(PATH, "isSublistOf", truthly(), isSublistOf));

    await tests.runAll();
}

function newListFromObject(): boolean
{
    const o = {};
    const list = new List(o);
    if (list.firstOrNull() !== o)
    {
        console.log(list, "first if");
        return false;
    }
    return true;
}

function newListFromArray(): boolean
{
    const o1 = {};
    const o2 = {};
    const os = [o1, o2];
    const list = new List(os);

    if (list.length !== 2)
    {
        console.log(list, "first if");
        return false;
    }

    if (list.get(0) !== o1)
    {
        console.log(list, "second if");
        return false;
    }

    if (list.get(1) !== o2)
    {
        console.log(list, "third if");
        return false;
    }

    return true;
}

function map(): boolean
{
    const o1 = { 'a1': 1, 'a2': 2, 'a3': 'x' };
    const o2 = { 'a1': 3, 'a2': 4, 'a3': 'y' };
    // @ts-nocheck
    const mapped = new List([o1, o2]).map(o =>
    {
        return { 'a1': o.a1 * 2, 'a3': 'z' };
    });

    if (mapped.first().a1 !== 2 || mapped.first().a2 || mapped.first().a3 !== 'z' ||
        mapped.get(1).a1 !== 6 || mapped.get(1).a2 || mapped.get(1).a3 !== 'z')
    {
        console.log('first if');
        console.log(mapped, 'mapped');
        return false;
    }
    return true;
}

function newListFromList(): boolean
{
    const o1 = {};
    const o2 = {};
    const os = new List([o1, o2]);
    const list = new List(os);

    if (list.length !== 2)
    {
        console.log(list, "first if");
        return false;
    }

    if (list.get(0) !== o1)
    {
        console.log(list, "second if");
        return false;
    }

    if (list.get(1) !== o2)
    {
        console.log(list, "third if");
        return false;
    }

    return true;
}

function isSublistOf()
{
    const list = new List(['a', 'b', 'c', 'd']);
    const sublist = new List(['b', 'c']);

    if (!sublist.isSublistOf(list))
    {
        console.log('first if');
        console.log(list, 'list');
        console.log(sublist, 'sublist');
        return false;
    }

    return true;
}