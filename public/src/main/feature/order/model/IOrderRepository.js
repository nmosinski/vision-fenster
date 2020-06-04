const PATH = "public/src/main/feature/order/model/IOrderRepository.js";

const IOrderRepository = (superclass=null) => 

/**
 * @alias IOrderRepository
 * @interface
 */
class extends superclass
{
	getOrder(orderId){}

	saveOrder(order){}

	updateOrder(order){}

	deleteOrder(orderId){}
}

export default IOrderRepository;