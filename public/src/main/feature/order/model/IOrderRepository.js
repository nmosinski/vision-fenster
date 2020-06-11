const PATH = "public/src/main/feature/order/model/IOrderRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IOrderRepository = (superclass=null) => 
{
	Object.defineProperty(IOrderRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getOrder) &&
		JsTypes.isFunction(instance.saveOrder) &&
		JsTypes.isFunction(instance.updateOrder) &&
		JsTypes.isFunction(instance.deleteOrder); 
	}, configurable: true});

	/**
	 * @alias IOrderRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		getOrder(orderId){throw new NotImplementedError(PATH, "IOrderRepository.getOrder()");}

		saveOrder(order){throw new NotImplementedError(PATH, "IOrderRepository.saveOrder()");}

		updateOrder(order){throw new NotImplementedError(PATH, "IOrderRepository.updateOrder()");}

		deleteOrder(orderId){throw new NotImplementedError(PATH, "IOrderRepository.deleteOrder()");}
	}

	return C;
}

export default IOrderRepository;