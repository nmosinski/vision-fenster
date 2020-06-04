const PATH = "public/src/main/feature/order/model/IOrderItemRepository.js";

const IOrderItemRepository = (superclass=null) => 

/**
 * @alias IOrderItemRepository
 * @interface
 */
 class extends superclass
{
	getOrderItem(orderItemId){}

	saveOrderItem(orderItem){}

	updateOrderItem(orderItem){}

	deleteOrderItem(orderItemId){}
}

export default IOrderItemRepository;