import fs from 'fs';
import { __dirname } from '../../../utils.js';
const pathFile = __dirname + '/db/products.json'



export const addProduct = async ({ title, description, price, thumbnails, code,status, category, stock }) => {
  try {
    if (!title || !description || !price || !thumbnails || !status || !category || !stock) {
      console.log(`Todos los parámetros son obligatorios, solo el stock puede ser 0`);
      return false;
    } else {
      const checkProduct = await checkCode(code);
      if (checkProduct === 'OK') {
        
        const maxId = await getMaxID()
        
        const product = {
          id: maxId + 1,
          title: title,
          description: description,
          code: code,
          price: price,
          status: status,
          stock: stock,
          category: category,
          thumbnails: thumbnails,
        };

        const productFile = await getProducts();
        productFile.push(product);
        await fs.promises.writeFile(pathFile, JSON.stringify(productFile));

        console.log(`Producto ${code} creado`);
        return `Producto ${code} creado`;

      } else {
        console.log(`El producto ${code} ya existe`);
        return `El producto ${code} ya existe`;
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

 
export const updateProduct = async (id, { title, description, price, thumbnails, code, status, category, stock }) => {

try {
    const productsOld = await getProducts();
    const productToUpdate = await getProductById(id);

    if (productToUpdate) {
      productToUpdate.title = title || productToUpdate.title; // linea 55
      productToUpdate.description = description || productToUpdate.description;
      productToUpdate.price = price || productToUpdate.price;
      productToUpdate.thumbnails = thumbnails || productToUpdate.thumbnails;
      productToUpdate.code = code || productToUpdate.code;
      productToUpdate.status = status || productToUpdate.status;
      productToUpdate.category = category || productToUpdate.category;
      productToUpdate.stock = stock || productToUpdate.stock;

      const updatedProducts = productsOld.map(product => {
        if (product.id === parseInt(id)) {
          return productToUpdate;
        }
        return product;
      });

      await fs.promises.writeFile(pathFile, JSON.stringify(updatedProducts));
      console.log(`Producto con ID ${id} actualizado`);
      return `Producto con ID ${id} actualizado`;
    } else {
      console.log(`El ID del producto ${id} no existe`);
      return `El ID del producto ${id} no existe`;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}


export const getProductById = async (productId) => {

  try {
    if (fs.existsSync(pathFile)) {
      const data = await fs.promises.readFile(pathFile, 'utf8');
      const datajs = JSON.parse(data);
      const product = datajs.find(product => product.id === productId);

      if (product) {
        console.log(product);
        return product;
      } else {
        console.log(`El ID del producto ${productId} no existe`);
        return null;
      }
    }
  }
  catch (error) {
    console.log(error);
    return error;
  }
}

export const getProducts = async () => {
  try {
    if (fs.existsSync(pathFile)) {
      const data = await fs.promises.readFile(pathFile, 'utf8');
      const datajs = JSON.parse(data);
      return datajs
    } else {
      //console.log('estoy devolviendo el array vacio de getproducts');
      return []
    }
  }
  catch (error) {
    console.log(error);
    return error;
  }
}

export const getMaxID = async () => {
  let maxId = 0;
  const products = await getProducts();
  products.map((prod) => {
    if (prod.id > maxId) maxId = prod.id;
  });
  return maxId;
};

export const checkCode = async (codeProduct) => {
  try {
    const productCheck = await getProducts()
    if (!productCheck.find(product => product.code === codeProduct)) {
      //console.log('estoy ok en checkCode')
      return 'OK';
    } else {
      //console.log('doy error en checkCode')
      return 'Error';
    }
  } catch (error) {
    console.log(error);
  }
}

export const deleteProduct = async (id) => {
  try {
    const productsOld = await getProducts();
    const productToDelete = await getProductById(id);

    if (!productToDelete) {
      console.log(`El ID del producto ${id} no existe`);
      return `El ID del producto ${id} no existe`;
    }

    const updatedProducts = productsOld.filter(product => product.id !== id);
    await fs.promises.writeFile(pathFile, JSON.stringify(updatedProducts));

    console.log(`Producto con ID ${id} eliminado`);
    return `Producto con ID ${id} eliminado`;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const deleteFile = async (pathFile) => {
  try {
    await fs.promises.unlink(pathFile);
    console.log(`El archivo ${pathFile} ha sido eliminado.`);
  } catch (error) {
    console.error(`Error al eliminar el archivo ${pathFile}: ${error}`);
  }
};
