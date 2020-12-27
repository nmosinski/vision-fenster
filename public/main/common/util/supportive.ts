import List from "./collections/list/List";
import KVMap from "./collections/map/KVMap";
import InstantiateError from "./error/InstantiateError";
import JsTypes from "./jsTypes/JsTypes";

const PATH = 'public/main/common/util/supportive';

export type AnyNumber<T> = T | T[] | List<T>;

export function instantiate<U>(Class: new () => U): U 
{
    try
    {
        return new Class();
    } catch (error)
    {
        throw new InstantiateError(Class, PATH, 'instantiate');
    }
}

/**
 * Checks if two entities are equal. In case of nested objects, the types of the nested objects can not be checked for equality.
 * @param {any} a: The first entity to be compared.
 * @param {any} b: The second entity to be compared.
 * @param {new() => U} Class: The class a and b should be of.
 * @returns {boolean} true of objects are equal, else false.
 */
export function areEqual<U>(a: any, b: any, Class?: new () => U): boolean
{
    if (JsTypes.isSpecified(Class) && !(JsTypes.isObject(a) && JsTypes.isObject(b) && a instanceof Class && b instanceof Class))
        return false;

    if (JsTypes.isObject(a))
    {
        if (!JsTypes.isObject(b))
            return false;

        if (JsTypes.isSpecified(a.equals))
        {
            if (!JsTypes.isSpecified(b.equals))
                return false;

            return a.equals(b);
        }

        const aMap = new KVMap(new Map(Object.entries(a)));
        const bMap = new KVMap(new Map(Object.entries(b)));

        if (aMap.length !== bMap.length)
            return false;

        let ret = true;

        aMap.foreach((key, value) =>
        {
            ret = ret && areEqual(value, b[key]);
        });

        return ret;
    }

    return a === b;
}