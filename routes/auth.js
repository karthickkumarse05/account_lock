const express = require('express')
const { register, login, getProfile, getUsers, adminUnlock } = require('../controllers/authController')
const { validateRegistration, validateLogin } = require('../middlewares/authValidator')
const authorize = require('../middlewares/authMiddleware')
const router = express.Router()

// user
router.post('/register', validateRegistration, register)
router.post('/login', validateLogin, login)
router.get('/profile', authorize, getProfile)

// admin
router.get('/admin/userProfiles', getUsers)
router.patch('/admin/unlock/:userId', adminUnlock)


module.exports = router