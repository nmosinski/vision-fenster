import Relation from "./Relation";
import AbstractStorableModel from "./AbstractStorableModel";

const PATH = "public/main/common/orm/NotManyToMany.js";


abstract class NotManyToMany<A extends AbstractStorableModel<A>, B extends AbstractStorableModel<B>> extends Relation<A, B>
{
}

export default NotManyToMany;