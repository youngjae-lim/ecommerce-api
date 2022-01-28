import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { StatusCodes } from 'http-status-codes'
import { NotFoundError, BadRequestError } from '../errors/index.js'
import { checkPermissions } from '../utils/checkPermissions.js'

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue'
  return { client_secret, amount }
}

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError('No cart items provided')
  }

  if (!tax || !shippingFee) {
    throw new BadRequestError('Please provide tax and shipping fee')
  }

  let orderItems = []
  let subtotal = 0

  // find each product in the cart by looping through cartItems
  for (const item of cartItems) {
    // find a product by _id
    const dbProduct = await Product.findOne({ _id: item.product })

    if (!dbProduct) {
      throw new NotFoundError(`No product with id: ${item.product}`)
    }

    const { name, price, image, _id } = dbProduct

    const singleOrderItem = {
      name,
      price,
      image,
      amount: item.amount,
      product: _id,
    }

    // add item to order
    orderItems = [...orderItems, singleOrderItem]

    // calculate subtotal
    subtotal += item.amount * price
  }

  // calculate total
  const total = tax + shippingFee + subtotal

  // get client secret using fake Stripe API
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currecy: 'usd',
  })
  // real example of using Stripe API
  // https://stripe.com/docs/payments/payment-intents#creating-a-paymentintent
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: 1099,
  //   currency: 'usd',
  //   payment_method_types: ['card'],
  // })

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    user: req.user.userId,
    clientSecret: paymentIntent.client_secret,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})

  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params

  const order = await Order.findOne({ _id: orderId })

  if (!order) {
    throw new NotFoundError(`No order with id: ${orderId}`)
  }

  checkPermissions(req.user, order.user)

  res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })

  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params

  // if a payment goes throug successfully, the client will receive paymentIntentId
  // with which the frontend will send to the server
  const { paymentIntentId } = req.body

  const order = await Order.findOne({ _id: orderId })

  if (!order) {
    throw new NotFoundError(`No order with id: ${orderId}`)
  }

  checkPermissions(req.user, order.user)

  order.paymentIntentId = paymentIntentId
  order.status = 'paid'

  await order.save()

  res.status(StatusCodes.OK).json({ order })
}

export {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
}
