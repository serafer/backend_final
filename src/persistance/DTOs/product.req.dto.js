import { logger } from "../../utils/logger.js";

export default function ProductDTO(product) {

  logger.debug('productDTO', product);
  return {
    
    title: product.nombre,
    description: product.descripcion,
    code: product.codigo,
    price: product.precio,
    status: product.estado,
    stock: product.stock,
    category: product.categoria,
    thumbnails: product.thumbnails
  };
}