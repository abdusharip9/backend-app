const express = require('express')
const adminController = require('../controllers/admin.controllerr')

const router = express.Router()

router.post('/login', adminController.login)
router.post('/register', adminController.register)

module.exports = router