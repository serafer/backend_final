import { ProductModel } from "./models/productModel.js";
import { logger } from "../../../utils/logger.js";

export const getProducts = async (
  page = 1,
  limit = 10,
  sort,
  filter,
  filterValue
) => {
  try {
    let sortOptions;
    let filterOptions = {};

    if (filter && filterValue) {
      filterOptions = { [filter]: { $regex: filterValue, $options: "i" } };
    }

    if (!sort) {
      const response = await ProductModel.paginate(filterOptions, {
        limit: limit,
        page: page,
      });
      return response;
    } else if (sort === "desc") {
      sortOptions = -1;
    } else {
      sortOptions = 1;
    }

    const response = await ProductModel.paginate(filterOptions, {
      limit: limit,
      page: page,
      sort: { price: sortOptions },
    });

    return response;
  } catch (error) {
    logger.fatal("Error DAO:" + error.message);
  }
};

export const getProductById = async (id) => {
  try {
    const response = await ProductModel.findById(id);
    return response;
  } catch (error) {
    logger.fatal("Error DAO:" + error.message);
  }
};

export const addProduct = async (product, user) => {
  try {
    let owner = user._id || "admin";

    const role = user.role;

    if (role !== "admin" && role !== "premium") return false;

    const response = await ProductModel.create({ ...product, owner: owner });
    return response;
  } catch (error) {
    logger.fatal("Error DAO:" + error.message);
  }
};

export const updateProduct = async (id, product, user) => {
  try {
    const role = user.role;
    const userID = user._id;
    const productDB = await ProductModel.findById(id);

    if (role === "admin") {
      const response = await ProductModel.findByIdAndUpdate(id, product, {
        new: true,
      });
      return response;
    } else if (role === "premium" && userID == productDB.owner) {
      const response = await ProductModel.findByIdAndUpdate(id, product, {
        new: true,
      });
      return response;
    } else return false;
  } catch (error) {
    logger.fatal("Error DAO:" + error.message);
  }
};

export const deleteProduct = async (id, user) => {
  try {
    const role = user.role;
    const userID = user._id;
    const productDB = await ProductModel.findById(id);

    console.log(productDB);
    
    const productOwner = await UserModel.findById(productDB.owner);
    
    console.log(productOwner);
    
    const productOwnerRole = productOwner.role


    //console.log('role: ' + role);
    //console.log('user: ' + user);
    //console.log('productDB: ' + productDB);

    if (role === "admin") {
      const response = await ProductModel.findByIdAndDelete(id);

      if (productOwnerRole === "premium") {

        await sendGmail (productOwner, 'productDeleted')
      }

      return response;
    } else if (role === "premium" && userID == productDB.owner) {
      const response = await ProductModel.findByIdAndDelete(id);

      if (productOwnerRole === "premium") {

        await sendGmail (productOwner, 'productDeleted')
      }


      return response;
    } else return false;
  } catch (error) {
    logger.fatal("Error DAO:" + error.message);
  }
};

// FackerJS - Mocks //

import { fakerES_MX as faker } from "@faker-js/faker";
import { ProductModelMocks } from "./models/productModel_Mocks.js";
import { UserModel } from "./models/userModel.js";
import { sendGmail } from "../../../services/emailServices.js";

export const createProductsMock = async (cant = 100) => {
  try {
    const products = [];

    for (let i = 0; i < cant; i++) {
      const data = await {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.commerce.isbn(),
        price: parseInt(faker.commerce.price()),
        stock: Math.floor(Math.random() * 99),
        category: faker.commerce.department(),
        thumbnails: faker.image.avatar(),
      };

      products.push(data);
    }
    //habilitar para que se grabe en Mongo
    //return await ProductModelMocks.create (products);
    return products;
  } catch (error) {
    logger.fatal("Error DAO:" + error.message);
  }
};

export const getProductsMocks = async () => {
  try {
    return await ProductModelMocks.find({});
  } catch (error) {
    logger.fatal("Error DAO:" + error.message);
  }
};
