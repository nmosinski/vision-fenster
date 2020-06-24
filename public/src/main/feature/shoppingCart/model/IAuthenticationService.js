const PATH = "public/src/main/feature/shoppingCart/model/IAuthenticationService.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @interface
 * Interface representing an authentication service.
 */
const IAuthenticationService = (superclass=null) => 
{
	Object.defineProperty(IAuthenticationService, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getCurrentUsersId) &&
		JsTypes.isFunction(instance.isCurrentUsersId); 
	}, configurable: true});

	/**
	 * @alias IAuthenticationService
	 * @interface
	 */
	const C = class extends superclass
	{
		/**
		 * Get current users id.
		 * @return {string} - The id of the current user.
		 */
		getCurrentUsersId(){throw new NotImplementedError(PATH, "IAuthenticationService.getCurrentUsersId()");}

		/**
		 * Check if the given id is the one from the current user.
		 * @param  {string}  id - The id of the user to be checked for if its the current one.
		 * @return {boolean} True if the id represents the current user, else false.
		 */
		isCurrentUsersId(id){throw new NotImplementedError(PATH, "IAuthenticationService.isCurrentUsersId()");}	
	}

	return C;
}

export default IAuthenticationService;