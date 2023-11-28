import { Schema, model } from "mongoose";

const productSchema = new Schema({
    ProductID: { type: Schema.Types.ObjectId, ref: "products" },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

export const ticketSchema = new Schema({
    code: { type: String, require: true },
    purchase_datetime: { type: String, require: true },
    amount: { type: Number, require: true },
    purchaser: { type: String, require: true },
    products: [productSchema], // Agrega un arreglo de productos al ticket
});

export const TicketModel = model("ticket", ticketSchema);
