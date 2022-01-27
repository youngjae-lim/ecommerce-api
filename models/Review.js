import mongoose from 'mongoose'

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
)

// each user is allowed to leave a comment per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

// static method of calculating avg rating for a product
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  // result will be an array of object - i.e., [{_id: , averageRating: , numOfReviews: }]
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null, // ignore _id because the productId is the same to all reviews for a single product
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ])

  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    )
  } catch (error) {
    console.log(error)
  }
}

// recalculate avg rating right after review is saved
ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

// recalculate avg rating right after review is removed
ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

export default mongoose.model('Review', ReviewSchema)
