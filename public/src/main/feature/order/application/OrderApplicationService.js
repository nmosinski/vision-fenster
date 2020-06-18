const PATH = "public/src/main/feature/order/application/OrderApplicationService.js";

class OrderApplicationService
{
	constructor(orderRepository, orderItemRepository)
	{
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
	}

	set orderRepository(orderRepository)
	{
		this._orderRepository = orderRepository;
	}

	set orderItemRepository(orderItemRepository)
	{
		this._orderItemRepository = orderItemRepository;
	}

	get orderRepository()
	{
		return this._orderRepository;
	}

	get orderItemRepository()
	{
		return this._orderItemRepository;
	}
}

export default OrderApplicationService;