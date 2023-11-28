import { CartsModel } from "./models/cartModel.js";
import { TicketModel } from "./models/ticketModel.js";
import { ProductModel } from "./models/productModel.js";
import { UserModel } from "./models/userModel.js";
import { logger } from '../../../utils/logger.js';


export const getCart = async () => {

    try {
        const response = await CartsModel.find({}).populate('products.ProductID')
        return response

    } catch (error) {
        logger.fatal('Error DAO: ' + error.message);
    }

}

export const getCartById = async (id) => {

    try {
        const response = await CartsModel.find({ _id: id }).populate('products.ProductID')
        return response

    } catch (error) {
        logger.fatal('Error DAO: ' + error.message);
    }

}

export const createCart = async () => {

    try {
        const newCart = await CartsModel.create({ products: [] })
        logger.debug('Cart created successfully')
        return newCart

    } catch (error) {
        logger.fatal('Error DAO: ' + error.message);
    }

}


export const saveProductToCart = async (id, productId, user) => {
    try {
        const cart = await CartsModel.findOne({ _id: id });
        //logger.debug("Carrito antes de la actualización:", cart);

        const prodIsInCart = cart.products.find((prod) => prod.ProductID.toString() === productId);
        //logger.debug("Producto encontrado en el carrito:", prodIsInCart);


        const userID = user.id;
        const prod = await ProductModel.findOne({ _id: productId })

        if (user.id === prod.owner && user.role === "premium") return "owner"

        if (prodIsInCart) {
            prodIsInCart.quantity++;
        } else {
            cart.products.push({
                ProductID: productId,
                quantity: 1
            });
        }

        cart.markModified("products"); // Marcar el array 'products' como modificado en ambos casos
        await cart.save();
        //logger.debug('Carrito actualizado exitosamente');
        //logger.debug("Carrito después de la actualización:", cart);
        return cart;
    } catch (error) {
        logger.fatal('Error DAO: ' + error.message);
    }
};



export const deleteProductInCart = async (id, productId) => {

    try {

        const cart = await CartsModel.findOne({ _id: id });
        //logger.debug("Carrito seleccionado:", cart);

        const prodIsInCart = cart.products.find((prod) => prod.ProductID.toString() === productId);
        //logger.debug("Producto encontrado en el carrito:", prodIsInCart);

        if (prodIsInCart) {

            //logger.debug("Producto Eliminado", productId);

            cart.products = cart.products.filter((prod) => prod.ProductID.toString() !== productId);



            //cart.markModified("products"); // Marcar el array 'products' como modificado en ambos casos
            await cart.save();
            //logger.debug('Carrito actualizado exitosamente', cart );
            //logger.debug("Carrito después de la actualización:", cart);
            return cart;
        } else {
            //logger.debug('Error: El producto no se encontró en el carrito');
            return cart; // Podrías lanzar una excepción o un mensaje de error más específico si lo deseas.
        }



    } catch (error) {
        logger.fatal('Error DAO: ' + error.message);
    }

}


export const cleanCart = async (id) => {
    try {
        const cart = await CartsModel.findById(id);

        if (cart) {
            cart.products = []; // Eliminar todos los productos del carrito

            await cart.save();
            logger.debug('Cart empty');
            return cart;
        } else {
            logger.warning('Error: cart not found');
            return null;
        }
    } catch (error) {
        logger.fatal('Error DAO: ' + error.message);
    }
};


export const updateQuantityInCart = async (id, productId, quantity) => {
    try {
        const cart = await CartsModel.findOne({ _id: id });
        //logger.debug("Carrito antes de la actualización:", cart);

        const prodIsInCart = cart.products.find((prod) => prod.ProductID.toString() === productId);
        //logger.debug("Producto encontrado en el carrito:", prodIsInCart);

        if (prodIsInCart) {
            const productIndex = cart.products.findIndex((prod) => prod.ProductID.toString() === productId.toString());
            if (productIndex === -1) {
                throw new Error('Product not found in the cart');
            }

            // Verificar si la cantidad enviada es un número válido
            if (!Number.isNaN(quantity) && Number.isInteger(quantity) && quantity >= 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                throw new Error('Invalid quantity value');
            }
        } else {
            logger.warning("Product not founded. Impossible to update quantity");
        }

        cart.markModified("products"); // Marcar el array 'products' como modificado en ambos casos
        await cart.save();
        //logger.debug('Carrito actualizado exitosamente');
        //logger.debug("Carrito después de la actualización:", cart);
        return cart;
    } catch (error) {
        logger.fatal('Error DAO: ' + error.message);
    }
}



export const updateCart = async (id, obj) => {
    try {
        // Primero, encuentra el carrito por su ID
        const cart = await CartsModel.findById(id);

        if (!cart) {
            throw new Error('Cart not found');
        }

        // Luego, actualiza el arreglo de productos (obj) con los datos proporcionados
        cart.products = obj;

        // Marca el arreglo 'products' como modificado
        cart.markModified('products');

        // Guarda los cambios en la base de datos
        await cart.save();

        //logger.debug('Carrito actualizado exitosamente');
        //logger.debug("Carrito después de la actualización:", cart);
        return cart;
    } catch (error) {
        logger.fatal('Error DAO: ' + error.message);
    }
}


export const generateTicket = async (userID, cartID) => {
    try {

        logger.debug('userID : ' + userID);
        logger.debug('cartID : ' + cartID);

        // Obtén el carrito del usuario
        const userCart = await CartsModel.findById(cartID);
        if (!userCart) {
            throw new Error('Cart not found');
        }

        // Inicializa un arreglo para almacenar los IDs de los productos que no se pueden comprar
        const productsNotPurchased = [];

        // Calcula el total de la compra y actualiza el stock de los productos en el carrito
        let totalAmount = 0;

        // Lista de productos que se han podido comprar
        const purchasedProducts = [];

        for (const productItem of userCart.products) {
            const productID = productItem.ProductID;
            const quantityInCart = productItem.quantity;

            // Obtén el producto de la base de datos
            const productDB = await ProductModel.findById(productID);

            if (!productDB) {
                throw new Error(`Product with ID ${productID} not found`);
            }

            // Verifica si hay suficiente stock
            if (quantityInCart <= productDB.stock) {
                const amount = quantityInCart * productDB.price;
                totalAmount += amount;

                // Resta la cantidad comprada del stock del producto en la base de datos
                productDB.stock -= quantityInCart;
                await productDB.save();

                // Agrega el producto al ticket
                purchasedProducts.push({
                    ProductID: productID,
                    quantity: quantityInCart,
                    price: productDB.price,
                });
            } else {
                // Si no hay suficiente stock, agrega el ID del producto a la lista de no comprados
                productsNotPurchased.push(productID);
            }
        }


        const generateRandomCode = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let code = '';
          
            for (let i = 0; i < 10; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              code += characters.charAt(randomIndex);
            }
          
            return code;
          };


        // Crea el ticket si se realizaron compras exitosas
        if (totalAmount > 0) {
            const ticket = await TicketModel.create({
                code: generateRandomCode(),
                purchase_datetime: new Date().toLocaleString(),
                amount: totalAmount,
                purchaser: userID, // Cambia esto si deseas almacenar el ID del usuario
                products: purchasedProducts,
            });

            // Actualiza el carrito del usuario solo con los productos que no se pudieron procesar
            userCart.products = userCart.products.filter(productItem => productsNotPurchased.includes(productItem.ProductID));
            userCart.markModified('products');
            await userCart.save();

            // Actualiza el usuario con el ID del ticket creado
            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: userID },
                { $push: { ticket: { TicketID: ticket.id } } },
                { new: true } // Devuelve el documento actualizado
            );

            // Maneja el caso en el que el usuario no se encuentra en la base de datos
            if (!updatedUser) {
                throw new Error(`User with ID ${userID} not found`);
            }

            return {
                ticket,
                productsNotPurchased,
                user: updatedUser
            };
        } else {
            // No se pudo realizar ninguna compra
            return {
                ticket: null,
                productsNotPurchased,
            };
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};






export const createCartTestMocks = async () => {

    try {
        const newCart = await CartsModel.create({})
        logger.debug('Cart created successfully')
        return newCart

    } catch (error) {
        logger.fatal('Error DAO: ' + error.message);
    }

}