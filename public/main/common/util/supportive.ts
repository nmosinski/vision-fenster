import List from "./collections/list/List";
import InstantiateError from "./error/InstantiateError";

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