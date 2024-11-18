const mongoose = require('mongoose');

const reviewsSchema = mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bookings',
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    rating: Number,
    comment : String,
    createdAt: {
        type: Date,
        default: Date.now, 
    },
});

const Review = mongoose.model('reviews', reviewsSchema);

module.exports = Review;