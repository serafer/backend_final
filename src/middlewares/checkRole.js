import { HttpResponse } from "../utils/http.response.js";
const httpResponse = new HttpResponse();
import error from "../utils/errors.dictionary.js";

export const ckeckAdminRole = async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin")
    return httpResponse.Unauthorized(res, error.UNAUTHORIZED);
  next();
};

export const ckeckAdminPremiumRole = async (req, res, next) => {
  const { role } = req.user;

  if (role !== "admin" && role !== "premium")
    return httpResponse.Unauthorized(res, error.UNAUTHORIZED);
  next();
};
