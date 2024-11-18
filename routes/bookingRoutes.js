const express = require('express'); 
const { newBooking, bookingDataByUserId, updateBookingStatusByBookingIdAndUserResponse, bookingDataBycustomerIdAndProviderId, getBookingCount } = require('../controllers/bookingController'); 
 
const router = express.Router(); 
 
router.post('/newBooking', newBooking); 
router.get('/bookingData/:userId', bookingDataByUserId)
router.patch('/updateBookingStatus/:id/userResponse', updateBookingStatusByBookingIdAndUserResponse)
router.get('/bookingDataBycustomerIdAndProviderId', bookingDataBycustomerIdAndProviderId);
router.get('/getBookingCount', getBookingCount)
module.exports = router; 
 