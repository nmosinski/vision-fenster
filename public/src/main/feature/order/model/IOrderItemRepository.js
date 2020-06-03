const PATH = "public/src/main/feature/order/model/IOrderItemRepository.js";

const IOrderItemRepository = (superclass) => 

/**
 * @alias IOrderItemRepository
 * @interface
 */
class extends superclass
{
	constructor(...args){super(args);}

	getOrderItem(orderItemId){}

	saveOrderItem(orderItem){}

	updateOrderItem(orderItem){}

	deleteOrderItem(orderItemId){}
}

export default IOrderItemRepository;