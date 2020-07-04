import OrderItem from "public/main/feature/order/model/OrderItem.js"
import List from "../../../common/util/collections/list/List.js"

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