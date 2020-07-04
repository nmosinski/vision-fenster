import Order from "public/main/feature/order/model/Order.js"

/**
 * @alias IOrderRepository
 * @interface
 */
interface IOrderRepository	
{
	/**
	 * @param {string} orderId 
	 */
	getOrder(orderId: string): Promise<Order>;

	
	/**
	 * @param  {Order} order
	 */
	saveOrder(order: Order): Promise<void>;

	
	/**
	 * @param  {Order} order
	 */
	updateOrder(order: Order): Promise<void>;

	
	/**
	 * @param  {string} orderId
	 */
	deleteOrder(orderId: string): Promise<void>;
}
export default IOrderRepository;