import * as service from '../services/cartServices.js'
import { getUserByID } from "../persistance/daos/mongodb/userDaoMongo.js";
import { HttpResponse } from "../utils/http.response.js"
const httpResponse = new HttpResponse();
import error from "../utils/errors.dictionary.js";

export const getCart = async (req, res, next) => {

    try {
        const cart = await service.getCartService()
        if (!cart) return httpResponse.NotFound(res, error.CART_NOT_FOUND)
        else return httpResponse.Ok(res, cart)
    } catch (error) {
        next(error.message)
    }
}

export const getCartById = async (req, res, next) => {

    try {
        const { id } = req.params
        const cart = await service.getCartByIdService(id)
        if (!cart) return httpResponse.NotFound(res, error.CART_NOT_FOUND)
        else return httpResponse.Ok(res, cart)
    } catch (error) {
        next(error.message)
    }
}

export const createCart = async (req, res, next) => {

    try {
        const cart = await service.createCartService()
        if (!cart) return httpResponse.NotFound(res, error.CART_NOT_CREATED)
        else return httpResponse.Ok(res, cart)
    } catch (error) {
        next(error.message)
    }
}

export const saveProductToCart = async (req, res, next) => {

    try {
        const { id, productId } = req.params
        const user = req.user
        const cart = await service.saveProductToCartService(id, productId, user)
        if (!cart) return httpResponse.NotFound(res, error.CART_NOT_UPDATED)
        if (cart === "owner") return httpResponse.Unauthorized(res, "Role Premium: cannot add your own product")
        else return httpResponse.Ok(res, cart)
    } catch (error) {
        next(error.message)
    }
}


export const deleteProductInCart = async (req, res, next) => {

    try {
        const { id, productId } = req.params
        const cart = await service.deleteProductInCartService(id, productId)
        if (!cart) return httpResponse.NotFound(res, error.CART_NOT_DELETED)
        else return httpResponse.Ok(res, cart)
    } catch (error) {
        next(error.message)
    }
}


export const cleanCart = async (req, res, next) => {

    try {
        const { id } = req.params
        const cart = await service.cleanCartService(id)
        if (!cart) return httpResponse.NotFound(res, error.CART_NOT_EMPTIED)
        else return httpResponse.Ok(res, cart)
    } catch (error) {
        next(error.message)
    }
}




export const updateQuantityInCart = async (req, res, next) => {

    try {
        const { id, productId } = req.params
        const { quantity } = req.body
        const cart = await service.updateQuantityInCartService(id, productId, quantity)
        if (!cart) return httpResponse.NotFound(res, error.CART_NOT_UPDATED)
        else return httpResponse.Ok(res, cart)

    } catch (error) {
        next(error.message)
    }
}


export const updateCart = async (req, res, next) => {

    try {
        const { id } = req.params
        const obj = req.body;
        const cart = await service.updateCartService(id, obj)

        if (!cart) return httpResponse.NotFound(res, error.CART_NOT_UPDATED)
        else return httpResponse.Ok(res, cart)

    } catch (error) {
        next(error.message)
    }
}

export const generateTicket = async (req, res, next) => {
    try {
        const user = await getUserByID(req.user);
        if (!user) {
            return httpResponse.NotFound(res, error.USER_NOT_FOUND)
        }


        const { id } = req.params

        const cartID = id ? id : user.cart[0].CartID;

        const userID = user.id;
        //const cartID = user.cart[0].CartID;
        //console.log('userID = ' + userID);
        //console.log('cartID = ' + cartID);

        const ticket = await service.generateTicketService(userID, cartID);
        if (!ticket) {
            return httpResponse.NotFound(res, error.TICKET_NOT_CREATED)
        }

        // Enviar el ticket como respuesta
        else return httpResponse.Ok(res, ticket)

    } catch (error) {
        next(error.message);
    }
}