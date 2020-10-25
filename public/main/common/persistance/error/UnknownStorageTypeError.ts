import AbstractUncheckedError from "../../util/error/AbstractUncheckedError";
import StorageTypeEnum from "../enum/StorageTypeEnum";

class UnknownStorageTypeError extends AbstractUncheckedError
{
    private _storageType: StorageTypeEnum;

    constructor (description: string = 'The requested storage type doesnt exist', file, location, storageType: StorageTypeEnum)
    {
        super(description, file, location);
        this.storageType = storageType;
    }

    toString()
    {
        let ret = super.toString();

        ret += '\nstorageType: ' + this.storageType;

        return ret;
    }

    set storageType(storageType: StorageTypeEnum)
    {
        this._storageType = storageType;
    }

    get storageType(): StorageTypeEnum
    {
        return this._storageType;
    }
}

export default UnknownStorageTypeError;