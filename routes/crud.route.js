const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const crudController = require('../controllers/crud.controller')
const checkAdminMiddleware = require('../middlewares/checkAdmin.middleware')

const router = express.Router()

// router.get('/getUsers', authMiddleware, checkAdminMiddleware, crudController.getUsers)
router.get('/getUsers', crudController.getUsers)
router.get('/all-kafes', crudController.allKafes)
router.get('/getUser/:id', authMiddleware, crudController.getUser)
router.post('/update-user/:id', authMiddleware, crudController.updateUser)
router.post('/update-user/add-kafeName/:id', authMiddleware, crudController.addKafe)
router.post('/update-user/delete-kafeName/:id', authMiddleware, crudController.deleteKafe)
router.get('/kafes/:adminId', authMiddleware, crudController.getUserKafes)
router.get('/kafes/:adminId/kafe/:kafeId', authMiddleware, crudController.getKafeUserData)

module.exports = router