const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceProviderId: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Users',
    }],
    serviceName: { type: String },
    category: { type: String },
    description: { type: String },
    serviceImage: {type: String },
    price: {type: String},
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  
  // Create the Service model
  const Service = mongoose.model('services', serviceSchema);
  
  module.exports = Service;