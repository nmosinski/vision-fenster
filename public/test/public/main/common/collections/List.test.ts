import { Tests, Test, truthly } from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
const PATH = "public/test/public/main/common/collections/List.test"

export async function runAllTests() {
    let tests = new Tests();

    tests.add(new Test(PATH, "new List from object", truthly(), newListFromObject));
    tests.add(new Test(PATH, "new List from array", truthly(), newListFromArray));
    tests.add(new Test(PATH, "new List from List", truthly(), newListFromList));

    await tests.runAll();
}

function newListFromObject(): boolean {
    let o = {};
    let list = new List(o);
    if (list.firstOrNull() !== o) {
        console.log(list, "first if");
        return false;
    }
    return true;
}

function newListFromArray(): boolean {
    let o1 = {};
    let o2 = {};
    let os = [o1, o2];
    let list = new List(os);

    if (list.length !== 2) {
        console.log(list, "first if");
        return false;
    }

    if (list.get(0) !== o1) {
        console.log(list, "second if");
        return false;
    }

    if (list.get(1) !== o2) {
        console.log(list, "third if");
        return false;
    }

    return true;
}

function newListFromList(): boolean {
    let o1 = {};
    let o2 = {};
    let os = new List([o1, o2]);
    let list = new List(os);

    if (list.length !== 2) {
        console.log(list, "first if");
        return false;
    }

    if (list.get(0) !== o1) {
        console.log(list, "second if");
        return false;
    }

    if (list.get(1) !== o2) {
        console.log(list, "third if");
        return false;
    }

    return true;
}