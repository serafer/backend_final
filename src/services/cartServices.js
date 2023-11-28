import { cleanCart, createCart, deleteProductInCart, getCart, getCartById, saveProductToCart, updateCart, updateQuantityInCart, generateTicket } from "../persistance/daos/mongodb/cartDaoMongo.js";
import { logger } from "../utils/logger.js";

export const getCartService = async () => {

    try {
        const cart = await getCart()
        return cart
    } catch (error) {
        logger.error('Error Service:', error.message);
    }

}

export const getCartByIdService = async (id) => {

    try {
        const cart = await getCartById(id)
        if (!cart) { return false; }
        else { return cart; }
    } catch (error) {
        logger.error('Error Service:', error.message);
    }
}


export const createCartService = async () => {

    try {
        const cart = await createCart()
        if (!cart) { return false; }
        else { return cart }


    } catch (error) {

        logger.error('Error Service:', error.message);
    }
}

export const saveProductToCartService = async (id, productId, user) => {

    try {
        const cart = await saveProductToCart(id, productId, user)

        return cart

    } catch (error) {
        logger.error('Error Service:', error.message);
    }

}


export const deleteProductInCartService = async (id, productId) => {

    try {
        const cart = await deleteProductInCart(id, productId)

        return cart

    } catch (error) {
        logger.error('Error Service:', error.message);
    }

}



export const cleanCartService = async (id) => {

    try {

        const cart = await cleanCart(id)
        return cart

    } catch (error) {
        logger.error('Error Service:', error.message);
    }
}


export const updateQuantityInCartService = async (id, productId, quantity) => {

    try {
        const cart = await updateQuantityInCart(id, productId, quantity);

        return cart

    } catch (error) {
        logger.error('Error Service:', error.message);
    }

}



export const updateCartService = async (id, obj) => {

    try {
        const cart = await updateCart(id, obj);

        return cart

    } catch (error) {
        logger.error('Error Service:', error.message);
    }

}


export const generateTicketService = async (userID, cartID) => {
    try {
        const ticket = await generateTicket(userID, cartID)
        if (!ticket) { return false; }
        else { return ticket }

    } catch (error) {
        logger.error('Error Service:', error.message);
    }
}
