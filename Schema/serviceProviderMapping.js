const mongoose = require('mongoose');

const serviceProviderMappingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'services'
    }
})

const ServiceProviderMapping = mongoose.model('serviceProviderMapping', serviceProviderMappingSchema);

module.exports = ServiceProviderMapping;