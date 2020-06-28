const PATH = "public/src/main/feature/order/application/OrderApplicationService.js";

import IOrderItemRepository from "public/src/main/feature/order/model/IOrderItemRepository.js"
import IOrderRepository from "public/src/main/feature/order/model/IOrderRepository.js"

/**
 * @class
 * A class representing an order application service.
 */
class OrderApplicationService
{
	private _orderItemRepository: IOrderItemRepository;
	private _orderRepository: IOrderRepository;
	/**
	 * Create an OrderApplicationService.
	 * @param {IOrderRepository} orderRepository The order repository.
	 * @param {IOrderItemRepository} orderItemRepository The order item repository.
	 */
	constructor(orderRepository: IOrderRepository, orderItemRepository: IOrderItemRepository)
	{
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
	}

	/**
	 * Set orderRepository.
	 * @param {IOrderRepository} orderRepository An OrderRepository.
	 */
	set orderRepository(orderRepository: IOrderRepository)
	{
		this._orderRepository = orderRepository;
	}

	/**
	 * Set orderItemRepository.
	 * @param {IOrderItemRepository} orderItemRepository An OrderItemRepository.
	 */
	set orderItemRepository(orderItemRepository: IOrderItemRepository)
	{
		this._orderItemRepository = orderItemRepository;
	}

	/**
	 * Get orderRepository.
	 * @returns {IOrderRepository} The orderRepository.
	 */
	get orderRepository(): IOrderRepository
	{
		return this._orderRepository;
	}

	/**
	 * Get orderItemRepository.
	 * @returns {IOrderItemRepository} The OrderItemRepository.
	 */
	get orderItemRepository(): IOrderItemRepository
	{
		return this._orderItemRepository;
	}
}

export default OrderApplicationService;