import ProductDTO from "../DTOs/product.req.dto.js";
import ProductResDTO from "../DTOs/product.res.dto.js";
import { ProductModel } from "../daos/mongodb/models/productModel.js";
import { logger } from "../../utils/logger.js";


export const getByIdDTO = async (id) => {
    try {
        const response = await ProductModel.findById(id);
        return new ProductResDTO(response)
    } catch (error) {
        logger.error('Error Repository: ' + error.message);
    }
}


export const createProdDTO = async (obj) => {
    try {
        const prodDTO = new ProductDTO(obj);
        const response = await ProductModel.create(prodDTO)
        return response
    } catch (error) {
        logger.error('Error Repository: ' + error.message);
    }
}


