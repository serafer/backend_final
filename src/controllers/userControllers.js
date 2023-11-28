import {
  getUserByEmail,
  getUserByID,
} from "../persistance/daos/mongodb/userDaoMongo.js";
import { sendGmail } from "../services/emailServices.js";
import {
  createUsersMockService,
  getAllService,
  getUsersMocksService,
  loginUserServices,
  removeOldUserServise,
  removeUserByIDService,
  resetPassService,
  updatePassService,
  updatePremiumRoleService,
} from "../services/userServices.js";
import { HttpResponse } from "../utils/http.response.js";
const httpResponse = new HttpResponse();
import error from "../utils/errors.dictionary.js";
import { getAllUserDTO } from "../persistance/repository/user.repositpry.js";

export const logoutUserC = async (req, res, next) => {
  try {
    const user = await getUserByID(req.session.passport.user);

    user.last_connection = new Date();
    await user.save();

    res.clearCookie("token");
    res.redirect("/login");
    
  } catch (error) {
    next(error.message);
  }
};

export const loginApi = async (req, res, next) => {
  try {
    const token = await loginUserServices(req.body);

    if (!token) return httpResponse.Unauthorized(res, error.USER_CREDENTIALS);

    res.cookie("token", token, { httpOnly: true });
    //res.header("Authorization", token);

    const email = req.body.email;

    const user = await getUserByEmail(email);

    const response = await sendGmail(user, "login");

    return httpResponse.Ok(res, { token });
  } catch (error) {
    next(error.message);
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await loginUserServices(req.body);

    if (!token) return httpResponse.Unauthorized(res, error.USER_CREDENTIALS);

    res.cookie("token", token, { httpOnly: true });
    //res.header("Authorization", token);

    const email = req.body.email;

    const user = await getUserByEmail(email);

    const response = await sendGmail(user, "login");

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/products?page=1");
  } catch (error) {
    next(error.message);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await getAllService();
    return httpResponse.Ok(res, data);
  } catch (error) {
    next(error.message);
  }
};


export const getAllDTO = async (req, res, next) => {
  try {
    const data = await getAllUserDTO();
    return httpResponse.Ok(res, data);
  } catch (error) {
    next(error.message);
  }
};


export const current = async (req, res, next) => {
  try {
    const userExists = await req.session;
    const userID = await getUserByID(req.session.passport.user);
    const user = userID.toObject();

    //console.log('hola: ', user);

    if (userExists) {
      res.render("current", { user });
    } else {
      res.render("login");
    }
  } catch (error) {
    next(error.message);
  }
};

export const resetPass = async (req, res, next) => {

  try {
    const user = req.user;
    const tokenResetPass = await resetPassService(user)

    if (!tokenResetPass) return httpResponse.NotFound(res, error.EMAIL_NOT_SENT)
    res.cookie('tokenpass', tokenResetPass)
    return httpResponse.Ok(res, { msg: 'Email sent successfully' })

  } catch (error) {
    next(error.message);
  }

}

export const updatePass = async (req, res, next) => {

  try {
    const user = req.user;
    const { password } = req.body
    const { tokenpass } = req.cookies


    if (!tokenpass) {
      res.redirect('reset-pass')
      return httpResponse.Forbidden(res, error.TOKEN_INVALID);
    }
    const updPass = await updatePassService(user, password);

    if (updPass === 'isEqual') return httpResponse.Forbidden(res, "New password must be different from current password")


    if (!updPass) return httpResponse.NotFound(res, error.PASSWORD_INVALID_POLICY);
    res.clearCookie('tokenpass');
    return httpResponse.Ok(res, { mesg: 'Password updated successfully' });

  } catch (error) {
    next(error.message);

  }
}

export const updatePremiumRole = async (req, res, next) => {
  try {

    const { uid } = req.params

    const response = await updatePremiumRoleService(uid)

    if (response === "USER_NOT_FOUND") return httpResponse.NotFound(res, error.USER_NOT_FOUND)
    if (response === "ADMIN_USER") return httpResponse.Forbidden(res, "Admin users cannot be updated")

    return httpResponse.Ok(res, response)

  } catch (error) {
    next(error.message);
  }

}




// borra los usuario con antiguedad // 

export const removeOldUser = async (req, res, next) => {
  try {
      const response = await removeOldUserServise();
      if (!response) return httpResponse.Forbidden(res, "Unautorized");
      return httpResponse.Ok(res, response);
  } catch (error) {
    next(error.message);;
  }
};


// eliminar usuario por id // 



export const removeById = async (req, res, next) => {
  try {
      const response = await removeUserByIDService(req.params.uid);
      if (!response) return httpResponse.Forbidden(res, "Unautorized");
      else return httpResponse.Ok(res, response)
  } catch (error) {
    next(error.message);;
  }
};


// MOCKS //

export const createUserMocks = async (req, res, next) => {
  try {
    const { cant } = req.query;
    const response = await createUsersMockService(cant);
    if (!response) return httpResponse.NotFound(res, error.USER_EXISTS);
    else return httpResponse.Ok(res, response);
  } catch (error) {
    next(error.message);
  }
};

export const getUsersMocks = async (req, res, next) => {
  try {
    const response = await getUsersMocksService();
    if (!response) return httpResponse.NotFound(res, error.USER_NOT_FOUND);
    else return httpResponse.Ok(res, response);
  } catch (error) {
    next(error.message);
  }
};
