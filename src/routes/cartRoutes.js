import { Router } from 'express'
import * as controller from '../controllers/cartControllers.js'
import passport from 'passport'
import { deleteProductInCartViews, saveProductToCartView } from '../controllers/viewsControllers.js'

const router = Router ()

router.get('/', passport.authenticate("jwt") , controller.getCart)

router.post('/', passport.authenticate("jwt") , controller.createCart)

router.get('/:id', passport.authenticate("jwt") , controller.getCartById)

router.delete('/:id', passport.authenticate("jwt") , controller.cleanCart)

router.put ('/:id', passport.authenticate("jwt") , controller.updateCart)

router.post('/:id/prod/:productId', passport.authenticate("jwt") , controller.saveProductToCart)
router.post('/:id/prod2/:productId', passport.authenticate("jwt") , saveProductToCartView)

router.delete('/:id/prod/:productId', passport.authenticate("jwt") , controller.deleteProductInCart)
router.post('/:id/prod3/:productId', passport.authenticate("jwt") , deleteProductInCartViews)

router.put ('/:id/prod/:productId', passport.authenticate("jwt") , controller.updateQuantityInCart)

router.post ('/:id/purchase', passport.authenticate('jwt') , controller.generateTicket)

router.post('/purchase', passport.authenticate("jwt") ,controller.generateTicket)

export default router