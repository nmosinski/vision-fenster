import IStorage from "../../../../main/common/persistance/IStorage";
import { AnyNumber } from "../../../../main/common/util/supportive";
// @ts-ignore
import wixData from "wix-data";
import List from "../../../../main/common/util/collections/list/List";

class WixDatabase implements IStorage
{
    async get(id: string, tableName: string): Promise<object>
    {
        return await wixData.get(tableName, id);
    }

    async has(id: string, tableName: string): Promise<boolean>
    {
        const item = await wixData.get(tableName, id);
        if (!item)
            return false;
    }

    async create(toCreate: AnyNumber<object>, tableName: string): Promise<void>
    {
        const toCreateList = new List<object>(toCreate);

        if (toCreateList.isEmpty())
            return;
        else if (toCreateList.length === 1)
            return await wixData.insert(tableName, toCreate);
        else
            return await wixData.bulkInsert(tableName, toCreateList.toArray());
    }

    async save(toSave: AnyNumber<object>, tableName: string): Promise<void>
    {
        const toSaveList = new List<object>(toSave);

        if (toSaveList.isEmpty())
            return;
        else if (toSaveList.length === 1)
            return await wixData.save(tableName, toSave);
        else
            return await wixData.bulkSave(tableName, toSaveList.toArray());
    }

    async update(toUpdate: AnyNumber<object>, tableName: string): Promise<void>
    {
        const toUpdateList = new List<object>(toUpdate);

        if (toUpdateList.isEmpty())
            return;
        else if (toUpdateList.length === 1)
            return await wixData.update(tableName, toUpdate);
        else
            return await wixData.bulkUpdate(tableName, toUpdateList.toArray());
    }

    async remove(toRemove: AnyNumber<string>, tableName: string): Promise<void>
    {
        const toRemoveList = new List<string>(toRemove);

        if (toRemoveList.isEmpty())
            return;
        else if (toRemoveList.length === 1)
            return await wixData.remove(tableName, toRemove);
        else
            return await wixData.bulkRemove(tableName, toRemoveList.toArray());
    }

    async truncate(tableName: string): Promise<void>
    {
        return await wixData.truncate(tableName);
    }
}

export default WixDatabase;