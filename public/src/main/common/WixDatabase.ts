import KVMap from "./util/collections/map/KVMap";

class ORM<T extends ORM<T>>
{
    
    constructor()
    {

    }

    take(a:T,b:T)
    {

    }


}

class K extends ORM<K>
{

}

class F extends ORM<F>
{

}

let k = new K();
let f = new F();
k.take(k,f);