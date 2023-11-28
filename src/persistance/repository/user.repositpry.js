import currentUserResDTO, { userResDTOArray } from "../DTOs/user.res.dto.js";
import { UserModel } from "../daos/mongodb/models/userModel.js";
import { logger } from "../../utils/logger.js";
import { getAll } from "../daos/mongodb/userDaoMongo.js";


export const getByIdDTO = async (id) => {
    try {
        const response = await UserModel.findById(id);

        //logger.debug('response from userRepository prev DTO: ' + response);
        return new currentUserResDTO(response)
    } catch (error) {
        logger.error('Error Repository: ' + error.message)
    }
}


export const getAllUserDTO = async () => {
    try {
      const user = await getAll();
      if (!user) {
        return false;
      } else {

        return new userResDTOArray(user)
      }
    } catch (error) {
      logger.error("Error Service:", error.message);
    }
  };