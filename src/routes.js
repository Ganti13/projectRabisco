const {Router} = require('express')
const multer = require('multer')
const LoginController = require('./app/controllers/LoginController')
const TatooController = require('./app/controllers/TatooController')
const UserController = require('./app/controllers/UserController')
const ImageController = require('./app/controllers/ImageController')
const auth = require('./app/middlewares/auth')
const multerConfig = require('./config/multerConfig')
const RefreshToken = require('./app/controllers/RefreshToken')
const validator = require('./app/middlewares/validator')

const router = Router()

router.post('/users', validator.user, UserController.store)
router.get('/users', [auth],UserController.index)
router.get('/users/:id', [auth],UserController.show)
router.put('/users/:id', [auth, validator.user], UserController.update)
router.delete('/users/:id',[auth], UserController.destroy)

router.put('/users/permission/:id', auth, UserController.setPermission)

router.post('/login', LoginController.login)
router.post('/refreshToken', RefreshToken.refreshToken)

router.post('/tatoos', [auth, multer(multerConfig).single('file')],TatooController.store)
router.get('/tatoos', [auth],TatooController.index)
router.get('/tatoos/:id',[auth] ,TatooController.show)
router.put('/tatoos/:id', [auth, multer(multerConfig).single('file')],TatooController.update)
router.delete('/tatoos/:id',[auth], TatooController.destroy)

router.get('/images/:path',TatooController.downloadImage)

router.post('/tatoos/:id/images', [auth, multer(multerConfig).any('files')], ImageController.store)
router.delete('/tatoos/:id/images/:imageId', [auth],ImageController.destroy)


module.exports = router 