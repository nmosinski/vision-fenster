import { AnyNumber } from "../../../../main/common/util/supportive";
// @ts-ignore
import wixData from "wix-data";
import List from "../../../../main/common/util/collections/list/List";
import IStorageDriver from "../../../../main/common/persistance/model/IStorageDriver";
import WixQuery from "./WixQuery";
import JsTypes from "../../../../main/common/util/jsTypes/JsTypes";

class WixDatabase implements IStorageDriver
{
    query(tableName: string): WixQuery
    {
        return new WixQuery(tableName);
    }

    /**
     * @override
     * @inheritdoc 
     */
    async get(id: string, tableName: string): Promise<{ [x: string]: any; id?: string; } | null>
    {
        const item = await wixData.get(tableName, id);

        if (JsTypes.isUnspecified(item))
            return null;

        return WixDatabase.mapItemToModel(item);
    }

    /**
     * @override
     * @inheritdoc 
     */
    async has(id: string, tableName: string): Promise<boolean>
    {
        const item = await wixData.get(tableName, id);
        if (!item)
            return false;

        return true;
    }

    /**
     * @override
     * @inheritdoc 
     */
    async create(toCreate: AnyNumber<object>, tableName: string): Promise<List<string>>
    {
        const toCreateList = new List<object>(toCreate).map(item => WixDatabase.mapModelToItem(item));

        if (toCreateList.isEmpty())
            return new List();
        else if (toCreateList.length === 1)
            return new List<{ _id: string }>(await wixData.insert(tableName, toCreateList.first())).map(item => WixDatabase.mapItemToModel(item)).pluck('id');
        else
            return new List<string>((await wixData.bulkInsert(tableName, toCreateList.toArray())).insertedItemIds);
    }

    /**
     * @override
     * @inheritdoc 
     */
    async save(toSave: AnyNumber<object>, tableName: string): Promise<List<string>>
    {
        const toSaveList = new List<object>(toSave).map(item => WixDatabase.mapModelToItem(item));

        if (toSaveList.isEmpty())
            return new List();
        else if (toSaveList.length === 1)
            return new List<{ _id: string }>(await wixData.save(tableName, toSaveList.first())).map(item => WixDatabase.mapItemToModel(item)).pluck('id');
        else
            return new List<string>((await wixData.bulkSave(tableName, toSaveList.toArray())).insertedItemIds);
    }

    /**
     * @override
     * @inheritdoc 
     */
    async update(toUpdate: AnyNumber<{ id: string }>, tableName: string): Promise<void>
    {
        const toUpdateList = new List<object>(toUpdate).map(item => WixDatabase.mapModelToItem(item));

        if (toUpdateList.isEmpty())
            return;
        else if (toUpdateList.length === 1)
            return await wixData.update(tableName, toUpdateList.first());
        else
            return await wixData.bulkUpdate(tableName, toUpdateList.toArray());
    }

    /**
     * @override
     * @inheritdoc 
     */
    async remove(toRemove: AnyNumber<string>, tableName: string): Promise<void>
    {
        const toRemoveList = new List<string>(toRemove);

        if (toRemoveList.isEmpty())
            return;
        else if (toRemoveList.length === 1)
            return await wixData.remove(tableName, toRemoveList.first());
        else
            return await wixData.bulkRemove(tableName, toRemoveList.toArray());
    }

    /**
     * @override
     * @inheritdoc 
     */
    async truncate(tableName: string): Promise<void>
    {
        return await wixData.truncate(tableName);
    }

    public static mapModelPropertyNameToItemPropertyName(modelPropertyName: string): string
    {
        return (modelPropertyName === 'id') ? '_id' : modelPropertyName;
    }

    public static mapItemPropertyNameToModelPropertyName(itemPropertyName: string): string
    {
        return (itemPropertyName === '_id') ? 'id' : itemPropertyName;
    }

    public static mapModelToItem(item: object): object
    {
        const keys = new List(Object.keys(item));

        const mappedItem: { [x: string]: any; _id?: string; } = {};

        keys.foreach(key => mappedItem[(key === 'id') ? '_id' : key] = item[key]);

        return mappedItem;
    }

    public static mapItemToModel(item: object): { [x: string]: any; id?: string; }
    {
        const keys = new List(Object.keys(item));

        const mappedItem: { [x: string]: any; id?: string; } = {};

        keys.foreach(key => mappedItem[(key === '_id') ? 'id' : key] = item[key]);

        return mappedItem;
    }
}

export default WixDatabase;