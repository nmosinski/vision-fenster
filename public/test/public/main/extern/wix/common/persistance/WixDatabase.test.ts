import WixDatabase from "../../../../../../../extern/wix/common/persistance/WixDatabase";
import { Test, Tests, truthly } from "../../../../../../../main/common/test/Test";
import List from "../../../../../../../main/common/util/collections/list/List";
import JsTypes from "../../../../../../../main/common/util/jsTypes/JsTypes";

const PATH = 'public/test/public/main/extern/wix/common/persistance/WixDatabase.test';

const wixDatabase = new WixDatabase();
const tableName = 'testWixDatabase';
const dbItems = [{ 'aNumber': 2 }, { 'aNumber': 3 }];

export async function runAllTests()
{
    const tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

    tests.add(new Test(PATH, "get", truthly(), get));
    tests.add(new Test(PATH, "has", truthly(), has));
    tests.add(new Test(PATH, "create", truthly(), create));
    tests.add(new Test(PATH, "save", truthly(), save));
    tests.add(new Test(PATH, "update", truthly(), update));
    tests.add(new Test(PATH, "remove", truthly(), remove));
    tests.add(new Test(PATH, "truncate", truthly(), truncate));

    await tests.runAll();
}

async function beforeAll()
{
    await afterEach();
}


async function beforeEach()
{
    await wixDatabase.create(dbItems, tableName);
}

async function afterEach()
{
    await wixDatabase.truncate(tableName);
}

async function create(): Promise<boolean>
{
    const itemId: string = (await wixDatabase.create({ 'aNumber': 4 }, tableName)).firstOrNull();

    if (JsTypes.isUnspecified(itemId))
    {
        console.log('first if');
        console.log('Returned itemId is unspecified');
    }

    const item = await wixDatabase.get(itemId, tableName);

    if (JsTypes.isUnspecified(item))
    {
        console.log('second if');
        console.log('Returned item is null');
        return false;
    }

    // @ts-ignore
    if (item.aNumber !== 4)
    {
        console.log('third if');
        console.log('Retrieved item doesnt match the created one.', item);
        return false;
    }

    return true;
}

async function save(): Promise<boolean>
{
    // @ts-ignore
    const itemId: string = (await wixDatabase.save({ 'aNumber': 4 }, tableName)).firstOrNull();

    if (JsTypes.isUnspecified(itemId))
    {
        console.log('first if');
        console.log('Returned itemId is unspecified');
    }

    const item = await wixDatabase.get(itemId, tableName);

    if (JsTypes.isUnspecified(item))
    {
        console.log('second if');
        console.log('Returned item is null');
    }

    // @ts-ignore
    if (item.aNumber !== 4)
    {
        console.log('third if');
        console.log('Retrieved item doesnt match the saved one.', item);
    }

    return true;
}

async function update(): Promise<boolean>
{
    const toSave = { 'id': 'this-is-an-id', aNumber: 4 };

    await wixDatabase.save(toSave, tableName);
    toSave.aNumber = -1;
    await wixDatabase.update(toSave, tableName);
    const retrievedItem = await wixDatabase.get(toSave.id, tableName);

    // @ts-ignore
    if (retrievedItem.aNumber !== toSave.aNumber)
    {
        console.log('first if');
        console.log('No items has been updated or the item has been updated wrong');
        console.log('inserted/updated: ' + toSave);
        console.log('retrieved: ' + retrievedItem);
    }

    return true;
}

async function truncate(): Promise<boolean>
{
    await wixDatabase.truncate(tableName);

    const retrieved = await wixDatabase.query(tableName).execute();

    if (retrieved.length !== 0)
    {
        console.log('first if');
        console.log('retrieved items after truncate.');
        console.log('retrieved items: ' + retrieved);
    }

    return true;
}

async function remove(): Promise<boolean>
{
    const toSave = { '_id': 'this-is-an-id', aNumber: 4 };

    await wixDatabase.save(toSave, tableName);
    await wixDatabase.remove(toSave._id, tableName);

    return !await wixDatabase.has(toSave._id, tableName);
}

async function get(): Promise<boolean>
{
    const toSave = { '_id': 'this-is-an-id', aNumber: 4 };
    let retrieved: object;

    await wixDatabase.save(toSave, tableName);
    try
    {
        retrieved = await wixDatabase.get(toSave._id, tableName);
        return !JsTypes.isUnspecified(retrieved);
    } catch (err)
    {
        console.log('first catch');
        console.log('couldnt retrieve the saved item');
        console.log('get returned:' + retrieved);
        return false;
    }
}

async function has(): Promise<boolean>
{
    const toSave = { '_id': 'this-is-an-id', aNumber: 4 };

    await wixDatabase.save(toSave, tableName);
    return await wixDatabase.has(toSave._id, tableName);
}