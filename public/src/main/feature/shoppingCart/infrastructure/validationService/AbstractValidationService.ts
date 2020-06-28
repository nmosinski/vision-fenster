/*
const PATH = "public/src/main/feature/shoppingCart/infrastructure/validationService/AbstractValidationService.js";

import AbstractValidationService from "public/src/main/feature/shoppingCart/model/IShoppingCartValidationService.js"
import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"
import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"

class ShoppingCartValidationService extends IShoppingCartValidationService()
{
	constructor(changable)
	{
		this.changable = changable;
	}

	validateAllChanges(oldObject, newObject)
	{
		return this._validateChanges(oldObject, newObject, this.changable);
	}

	validatePrimitiveChanges(oldObject, newObject)
	{
		return this._validateChanges(oldObject, newObject, this.changable.filter((attributeName) => {JsTypes.isPrimitive(oldObject[attributeName]);}));
	}

	_validateChanges(oldObject, newObject, changable)
	{
		changable.foreach(attributeName => {
			newObject[attributeName] = oldObject[attributeName];
		});

		return newObject.equals(oldObject);
	}

	shoppingCartUpdateRequest(oldShoppingCart, newShoppingCart)
	{
		id, userId, items=null
		if(oldShoppingCart.id !== newShoppingCart.id || oldShoppingCart.userId !== newShoppingCart.userId)
			return false;

		
	}

	set changable(changable)
	{
		this._changable = changable;
	}
}
*/