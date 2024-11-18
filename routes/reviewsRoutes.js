const express = require('express'); 

const { newReview, getProviderReviews, isBookingReviewed } = require('../controllers/reviewsController');

const router = express.Router(); 

router.post('/newReview', newReview); 
router.get('/getProviderReviews', getProviderReviews)
router.get('/isBookingReviewed', isBookingReviewed);

module.exports = router; 