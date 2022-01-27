const getAllOrders = async (req, res) => {
  res.send('get all orders')
}

const getSingleOrder = async (req, res) => {
  res.send('get single order')
}

const getCurrentUserOrders = async (req, res) => {
  res.send('get current user orders')
}

const createOrder = async (req, res) => {
  res.send('createOrder')
}

const updateOrder = async (req, res) => {
  res.send('update order')
}

export {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}
