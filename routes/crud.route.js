const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const crudController = require('../controllers/crud.controller')

const router = express.Router()

router.get('/getUser/:id', authMiddleware, crudController.getUser)
// router.get('/getPassword/:id', authMiddleware, crudController.getPassword)
router.post('/update-user/:id', authMiddleware, crudController.updateUser)
router.post(
	'/update-user/add-kafeName/:id',
	authMiddleware,
	crudController.addKafe
)
router.post(
	'/update-user/add-phone/:id',
	authMiddleware,
	crudController.addPhone
)
router.post(
	'/update-user/delete-kafeName/:id',
	authMiddleware,
	crudController.deleteKafe
)
router.post(
	'/update-user/delete-phone/:id',
	authMiddleware,
	crudController.deletePhone
)

// admin ning kafelarini olish, admin id orqali
router.get('/kafes/:adminId', authMiddleware, crudController.getKafes)

// kafe ning foydalanuvchilari user larini olish, kafe id orqali
router.get('/kafes/:kafeId/users', authMiddleware, crudController.getKafeUsers)

// kafe ga foydalanuvchi, user qo'shish uchun
router.post('/kafes/:adminId/add-user/:kafeId', authMiddleware, crudController.addKafeUser)

router.get('/kafe/:adminId/get-kafe-data/:kafeId', authMiddleware, crudController.getKafeUserData)

module.exports = router
