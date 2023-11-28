import { Schema, model} from "mongoose"

const cartSchemaID = new Schema({
    
    CartID: {
        type: Schema.Types.ObjectId,
        ref: "carts",
        required: true,
    },
    _id: false,
    
})

const ticketSchemaID = new Schema({

    TicketID: {
        type: Schema.Types.ObjectId,
        ref: "ticket",
        required: true,
        _id: false

    }

})


const userSchema = new Schema ({

first_name: {type: String, required: true},
last_name: {type: String, required: true},
email: {type: String, required: true, unique: true},
age: {type: Number, required: true, default: 0},
password: {type: String, required: true, default: ""},
role: {type: String, default: 'user'},
isGithub: {type: Boolean, required: true, default: false},
last_connection: {type: Date, default: new Date},
cart: {type: [cartSchemaID], required: true},
ticket: {type: [ticketSchemaID], required:true},
documents: [
    { 
        name: { type: String },
        reference: { type: String }
    }
],
status: { type: Boolean, default: false }

})
export const UserModel = model ('user', userSchema )