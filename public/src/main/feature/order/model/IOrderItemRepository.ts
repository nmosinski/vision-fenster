import OrderItem from "public/src/main/feature/order/model/OrderItem.js"
import List from "public/src/main/common/util/list/List.js"

/**
	 * @alias IOrderItemRepository
	 * @interface
	 */
interface IOrderItemRepository
{
	/**
	 * @param {string} orderItemId 
	 */
	getOrderItem(orderItemId: string): Promise<OrderItem>;
	
	/**
	 * @param  {string} orderId
	 * @returns {Promise<List<OrderItem>>}
	 */
	getOrderItemsByOrderId(orderId: string): Promise<List<OrderItem>>;
	
	/**
	 * @param  {OrderItem} orderIte
	 */
	saveOrderItem(orderItem: OrderItem): Promise<void>;

	
	/**
	 * @param  {OrderItem} orderItem
	 */
	updateOrderItem(orderItem: OrderItem): Promise<void>;

	
	/**
	 * @param  {string} orderItemId
	 */
	deleteOrderItem(orderItemId: string): Promise<void>;
}

export default IOrderItemRepository;