import WixDatabase from "../../../../extern/wix/common/persistance/WixDatabase";
import StorageTypeEnum from "../enum/StorageTypeEnum";
import UnknownStorageTypeError from "../error/UnknownStorageTypeError";
import IStorageDriver from "../model/IStorageDriver";

const PATH = 'public/main/common/persistance/StorageFactory';

class StorageFactory
{
    /**
     * Creates a storage of the given type.
     * @param {StorageTypeEnum} storageType The type of the storage to be created.
     * @returns {StorageTypeEnum} The requested storage.
     * @throws {UnknownStorageTypeError} If the requested storage dype doesnt exist of has not beed registered. 
     */
    public static create(factory: StorageTypeEnum): IStorageDriver
    {
        switch (factory)
        {
            case StorageTypeEnum.WIX_DATABASE:
                return new WixDatabase();
            default:
                throw new UnknownStorageTypeError(undefined, PATH, 'createFactory', factory);
        }
    }
}

export default StorageFactory;