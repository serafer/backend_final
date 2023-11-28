export default function ProductResDTO(product) {
    return {
        nombre: product.title,
        precio: product.price,
        disponibilidad: product.stock
    };
}