import fs from 'fs';
import { __dirname } from '../../../utils.js';
//import { getProductById } from './productManager.js';
const pathFile = __dirname + "/db/carts.json";


export const getCart = async () => {
    try {
        if (fs.existsSync(pathFile)) {
            const data = await fs.promises.readFile(pathFile, 'utf8');
            const cartJSON = JSON.parse(data);
            return cartJSON
        } else {
            return []
        }
    }
    catch (error) {
        console.log(error);
        return error;
    }
}



export const createCart = async () => {
    try {
        const getMaxIDCart = async () => {
            let maxId = 0;
            const cartMax = await getCart();
            cartMax.map((prod) => {
                if (prod.id > maxId) maxId = prod.id;
            });
            return maxId;
        };

        const maxId = await getMaxIDCart()
        const cart = {
            id: maxId + 1,
            products: [],
        };
        const cartFile = await getCart();
        cartFile.push(cart);
        await fs.promises.writeFile(pathFile, JSON.stringify(cartFile));

        return `Cart ${cart.id} has been created successfully`;

    } catch (error) {
        console.log(`Error`);
        return error;
    }
}




export const getCartById = async (cartId) => {

    try {
        const carts = await getCart()
        const cart = carts.find(cart => cart.id === cartId);

        if (cart) {
            return cart;
        } else {
            console.log(`Cart ${cartId} not found`);
            return false;
        }

    }
    catch (error) {
        console.log(error);
        return error;
    }
}



export const saveProductToCart = async (idCartNum, idProductNum) => {
    try {
      const cartProd = {
        id: idProductNum,
        quantity: 1,
      };
  
      const cartsFile = await getCart();
      const cartIdIndex = cartsFile.findIndex((cart) => cart.id === idCartNum);
  
      if (cartIdIndex > -1) {
        const prodIdIndex = cartsFile[cartIdIndex].products.findIndex(
          (product) => product.id === idProductNum
        );
  
        if (prodIdIndex > -1) {
          // El producto ya existe en el carrito, incrementar la cantidad
          cartsFile[cartIdIndex].products[prodIdIndex].quantity++;
        } else {
          // El producto no existe en el carrito, agregarlo
          cartsFile[cartIdIndex].products.push(cartProd);
        }
  
        // Escribir el arreglo de carritos actualizado en el archivo
        await fs.promises.writeFile(pathFile, JSON.stringify(cartsFile));
  
        return cartsFile;
      } else {
        return 'Error: cart ID not found';
      }
    } catch (error) {
      return { message: error.message || error.message };
    }
  };