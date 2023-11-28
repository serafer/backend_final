import { getUserByID } from "../persistance/daos/mongodb/userDaoMongo.js";
import { HttpResponse } from "../utils/http.response.js";
import error from "../utils/errors.dictionary.js";
import {
  deleteProductInCartService,
  getCartByIdService,
  saveProductToCartService,
} from "../services/cartServices.js";

export const register = async (req, res, next) => {
  try {
    res.render("register");
  } catch (error) {
    next(error.message);
  }
};

export const errorRegister = async (req, res, next) => {
  try {
    res.render("errorRegister");
  } catch (error) {
    next(error.message);
  }
};

export const login = async (req, res, next) => {
  try {
    res.render("login");
  } catch (error) {
    next(error.message);
  }
};

export const errorLogin = async (req, res, next) => {
  try {
    res.render("errorLogin");
  } catch (error) {
    next(error.message);
  }
};

export const errorAlert = async (req, res, next) => {
  try {
    res.render("errorAlert");
  } catch (error) {
    next(error.message);
  }
};

export const current = async (req, res, next) => {
  try {
    const userExists = await req.session;
    const userID = await getUserByID(req.session.passport.user);
    const user = userID.toObject();

    if (userExists) {
      res.render("current", { user });
    } else {
      res.render("login");
    }
  } catch (error) {
    next(error.message);
  }
};

export const saveProductToCartView = async (req, res, next) => {
  try {
    const { id, productId } = req.params;
    const user = req.user;
    const cart = await saveProductToCartService(id, productId, user);
    if (!cart) return res.redirect("/error-alert");
    if (cart === "owner") res.redirect("/error-alert");
    else return res.redirect(`/cart/${id}`);
  } catch (error) {
    next(error.message);
  }
};

export const cartView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await getCartByIdService(id);

    const userPrev = req.user

    const user = userPrev.toObject();

    const cartID = user.cart[0].CartID;


    if (!cart) return res.redirect("/error-alert");
    else {
      const cartMap = cart[0].products.map((cart) => ({
        ...cart.toObject(),
        cartID: id,
      }));


      res.status(200).render("cart", { cartItems: cartMap, user, cartID });
    }
  } catch (error) {
    next(error.message);
  }
};


export const deleteProductInCartViews = async (req, res, next) => {

  try {
      const { id, productId } = req.params
      const cart = await deleteProductInCartService(id, productId)
      if (!cart) return res.redirect("/error-alert")
      else return res.redirect(`/cart/${id}`)
  } catch (error) {
      next(error.message)
  }
}