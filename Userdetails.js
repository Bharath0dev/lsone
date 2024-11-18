const mongoose = require('mongoose');

const UserdetailSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    mobile: String,
    password: String,
    role: String,
}, {
    collection: 'UserInfo',
})

const Userdetails = mongoose.model('UserInfo', UserdetailSchema)

module.exports = Userdetails;