const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'services'
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    scheduledDate: {
        type: Date,
        required: true,
    },
    preferredTime: {
        type: String,
        // required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'declined', 'completed'],
        default: 'pending',
    },
    bookingId: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Booking = mongoose.model('Bookings', BookingSchema);

module.exports = Booking;