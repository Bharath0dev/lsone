const express = require("express");
const { updateAvailability, getProviderUnAvailability, getDatesToHide } = require('../controllers/availabilityController');
const router = express.Router();

router.post('/updateAvailability', updateAvailability);
router.get('/getProviderUnAvailability', getProviderUnAvailability);
router.get('/getDatesToHide', getDatesToHide);

module.exports = router;