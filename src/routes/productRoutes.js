import { Router } from "express";
import * as controller from "../controllers/productControllers.js"
import { ckeckAdminPremiumRole, ckeckAdminRole } from "../middlewares/checkRole.js";
import passport from "passport";


const router = Router ()

// -------  DTO  ----- // 

router.get('/dto/:id', passport.authenticate('jwt') , ckeckAdminRole, controller.getByIdDTO)
router.post('/dto', passport.authenticate('jwt') , ckeckAdminRole, controller.createProdDTO)


// -------  MOCKS  ----- // 

router.post("/mockingproducts", controller.createProductsMocks);
router.get("/getmockingproducts", passport.authenticate('jwt') , controller.getProductsMocks);


// -------  Resto de apis  ----- // 

router.get('/',passport.authenticate('jwt') , controller.getproduct)

router.get('/:id', passport.authenticate('jwt') , controller.getProductById)

router.post('/', passport.authenticate('jwt') , ckeckAdminPremiumRole, controller.addProduct)

router.put('/:id', passport.authenticate('jwt') , ckeckAdminPremiumRole, controller.updateProduct)

router.delete('/:id', passport.authenticate('jwt') , ckeckAdminPremiumRole ,controller.deleteProduct)




export default router