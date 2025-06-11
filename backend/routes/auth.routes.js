const router = require('express').Router();
const { register, login, userDetails, adminLogin } = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth');
const isAdmin = require('../middlewares/adminAuth');

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin); // Correctly uses controller
router.get('/verify', authenticate, userDetails);
router.get('/admin/verify', authenticate, isAdmin, userDetails);

module.exports = router;
