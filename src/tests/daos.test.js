import { assert, expect } from "chai";
import {
  addProduct,
  deleteProduct,
} from "../persistance/daos/mongodb/productDaoMongo.js";
import { conectionMongoose } from "../persistance/daos/mongodb/conection.js";
import {
  cleanCart,
  getCartById,
  saveProductToCart,
} from "../persistance/daos/mongodb/cartDaoMongo.js";
import { loginUser } from "../persistance/daos/mongodb/userDaoMongo.js";
import config from "../utils/config.js";

describe("Tests Unitarios en DAOs", async () => {
  before(async () => {
    const init = await conectionMongoose();
    console.log("*****conexión mongo******");
  });

  it("TEST DAO Products: Debería agregar un producto correctamente para un usuario administrador", async () => {
    const product = {
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto",
      code: "ABC123",
      price: 99.99,
      status: true,
      stock: 50,
      category: "Electrónicos",
      thumbnails: "url_de_la_imagen",
    };

    const user = {
      _id: "id_del_usuario_administrador",
      role: "admin",
    };

    const response = await addProduct(product, user);

    assert.isObject(response, "La respuesta debería ser un objeto");
    assert.equal(
      response.title,
      "Nuevo Producto",
      'El título del producto debería ser "Nuevo Producto"'
    );
    expect(response).to.have.property("_id");

    const deleteProducts = await deleteProduct(response.id, user);
  }).timeout(4000);

  it("TEST DAO Products: No debería agregar un producto para un usuario no administrador", async () => {
    const product = {
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto",
      code: "ABC123",
      price: 99.99,
      status: true,
      stock: 50,
      category: "Electrónicos",
      thumbnails: "url_de_la_imagen",
    };

    const user = {
      _id: "id_del_usuario_no_administrador",
      role: "regular",
    };

    const response = await addProduct(product, user);
    assert.isFalse(
      response,
      "La respuesta debería ser falsa porque el usuario no tiene permisos"
    );
  });

  it("TEST DAO Cart: Debería aumentar la cantidad de unidades de productos en el carrito", async () => {
    const prod = {
      _id: "64bf228eff8965169aaf06d4",
      title: "Vodka Absolut",
      description:
        "Vodka sueco premium, ideal para disfrutar en tragos o solo.",
      code: "AB002",
      price: 1200,
      status: true,
      stock: 2999999,
      category: "Vodka",
      thumbnails:
        "https://http2.mlstatic.com/D_NQ_NP_2X_968908-MLA32867454038_112019-F.webp",
      __v: 0,
      owner: "admin",
    };

    const cartID = "6519fdff96651b0962b5b438";

    const user = {
      _id: "65091be5e8e0c90fe7445993",
      role: "user",
    };

    const cart = await getCartById(cartID);

    expect(Array.isArray(cart[0].products)).to.be.equal(true);

    expect(cart[0].products).to.have.length(0);

    const addProduct = await saveProductToCart(cartID, prod._id, user);

    expect(addProduct.products[0].quantity).to.be.equal(1);
  }).timeout(3000);

  it("TEST DAO Cart: Debe vaciar el carrito", async () => {
    const cartID = "6519fdff96651b0962b5b438";

    const cart = await getCartById(cartID);

    expect(cart[0].products).to.have.length(1);

    const cleanedCart = await cleanCart(cartID);

    expect(Array.isArray(cleanedCart.products)).to.be.equal(true);

    expect(cleanedCart.products).to.have.length(0);
  }).timeout(4000);

  it("TEST DAO User: Debería devolver el usuario si las credenciales son correctas", async () => {
    const user = {
      email: config.EMAIL_TEST,
      password: config.PASSWORD_TEST,
    };

    const response = await loginUser(user);

    expect(response).to.be.an("object");
    expect(response).to.have.property("_id");
    expect(response).to.have.property("email", user.email);
  });

  it("TEST DAO User: Debería devolver false si las credenciales son incorrectas", async () => {
    const user = {
      email: config.EMAIL_TEST,
      password: "contraseñaIncorrecta",
    };

    const response = await loginUser(user);

    expect(response).to.be.false;
  });

  it("TEST DAO User: Debería devolver false si el usuario no existe", async () => {
    const user = {
      email: "correoInexistente@ejemplo.com",
      password: "cualquierContraseña",
    };

    const response = await loginUser(user);

    expect(response).to.be.false;
  });
}).timeout(10000);



