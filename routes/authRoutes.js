const express = require('express'); 
const { register, login, userData, emailVerification, updatePassword } = require('../controllers/authController'); 
 
const router = express.Router(); 
 
router.post('/register', register); 
router.post('/login-user', login); 
router.post('/userdata', userData); 
router.get('/emailVerification', emailVerification);
router.patch('/updatePassword', updatePassword);

module.exports = router; 
