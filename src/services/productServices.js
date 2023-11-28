import { addProduct, createProductsMock, deleteProduct, getProductById, getProducts, getProductsMocks, updateProduct } from "../persistance/daos/mongodb/productDaoMongo.js";
import { createProdDTO, getByIdDTO } from "../persistance/repository/product.repository.js";
import { logger } from "../utils/logger.js";

export const getProductsService = async (page, limit, sort, filter, filterValue) => {
    try {
        const response = await getProducts (page, limit, sort, filter, filterValue )
        return response
    } catch (error) {
        logger.error('Error Service:', error.message);
    }
}

export const getProductByIdService = async (id) => {
    try {
        const item = await getProductById (id)
         if (!item) {return false;}
         else {return item}
        
    } catch (error) {
        logger.error('Error Service:', error.message);
    }
}

export const addProductService = async (product, user) => {
    try {
        const newProduct = await addProduct (product, user)

        if (!newProduct) {return false;}
        else {return newProduct}

    } catch (error) {
        logger.error('Error Service:', error.message);
    }
}

export const updateProductService = async (id, product, user) => {
    try {
        const updateProd = await updateProduct (id, product, user)

        if (!updateProd) {return false;}
        return updateProd

    } catch (error) {
        logger.error('Error Service:', error.message);
    }
}

export const deleteProductService = async (id, user) => {
    try {
        const deleteProd = await deleteProduct (id, user)
        
        if (!deleteProd) {return false;}
        return deleteProd

    } catch (error) {
        logger.error('Error Service:', error.message);
    }
}


// -------  DTO  ----- // 

export const getByIdDTOService = async (id) => {
    try {
        const item = await getByIdDTO (id)
         if (!item) {return false;}
         else {return item}
        
    } catch (error) {
        logger.error('Error Service:', error.message);
    }
}

export const createProdDTOService = async (obj) => {
    try {
        const newProduct = await createProdDTO (obj)

        if (!newProduct) {return false;}
        else {return newProduct}

    } catch (error) {
        logger.error('Error Service:', error.message);
    }
}





    //  MOCKS  //

    export const createProductsMockService = async (prod) => {

        try {
            const newProd = await createProductsMock(prod);
            return newProd
        } catch (error) {
            logger.error('Error Service:', error.message);
        }
    }
    
    
    
    export const getProductsMocksService = async () => {
    
        try {
            const prod = await getProductsMocks()
            if (!prod) { return false; }
            else { return prod; }
        } catch (error) {
            logger.error('Error Service:', error.message);
        }
    }
