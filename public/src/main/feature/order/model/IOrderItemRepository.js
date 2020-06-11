const PATH = "public/src/main/feature/order/model/IOrderItemRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IOrderItemRepository = (superclass=null) => 
{
	Object.defineProperty(IOrderItemRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getOrderItem) && 
		JsTypes.isFunction(instance.saveOrderItem) &&
		JsTypes.isFunction(instance.updateOrderItem) &&
		JsTypes.isFunction(instance.deleteOrderItem) &&
		JsTypes.isFunction(instance.getOrderItemsByOrderId); 
	}, configurable: true});

	/**
	 * @alias IOrderItemRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		getOrderItem(orderItemId){throw new NotImplementedError(PATH, "IOrderItemRepository.getOrderItem()");}

		getOrderItemsByOrderId(orderId){throw new NotImplementedError(PATH, "IOrderItemRepository.getOrderItemsByOrderId()");}

		saveOrderItem(orderItem){throw new NotImplementedError(PATH, "IOrderItemRepository.saveOrderItem()");}

		updateOrderItem(orderItem){throw new NotImplementedError(PATH, "IOrderItemRepository.updateOrderItem()");}

		deleteOrderItem(orderItemId){throw new NotImplementedError(PATH, "IOrderItemRepository.deleteOrderItem()");}
	}

	return C;
}

export default IOrderItemRepository;