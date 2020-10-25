import { AnyNumber } from "../util/supportive";

interface IStorage
{
    get(id: string, tableName: string): Promise<object>;

    has(id: string, tableName: string): Promise<boolean>;

    create(toCreate: AnyNumber<object>, tableName: string): Promise<void>;

    save(toSave: AnyNumber<object>, tableName: string): Promise<void>;

    update(toUpdate: AnyNumber<object>, tableName: string): Promise<void>;

    remove(toRemove: AnyNumber<string>, tableName: string): Promise<void>;

    truncate(tableName: string): Promise<void>
}

export default IStorage;