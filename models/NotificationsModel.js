const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    notificationType: String,
    heading: String,
    message: String,
    isread: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
        required: true,
    }
})

const Notification = mongoose.model('notifications', NotificationSchema);

module.exports = Notification;