import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartProductSchema = new mongoose.Schema({
  ProductID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  _id: false,
});

const cartSchema = new mongoose.Schema({
  products: {
    type: [cartProductSchema],
    slectc: false,
    required: true,
  },
});

cartSchema.plugin(mongoosePaginate);

export const CartsModel = mongoose.model("carts", cartSchema);
