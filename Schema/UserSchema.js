const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true 
  },
  role: {
      type: String,
      enum: ['Customer', 'Admin', 'ServiceProvider'],
      required: true
  },
  mobile: {
    type: String,
    required: true,
    pattern: "^[0-9]{10}$",
  },
  providerDetails: {
    // service_id:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'services'
    // },
    // name:{
    //   type: [String], 
    //   default: null,
    // },
    // category: {
    // type: [String], 
    // default: null
    // },
    qualifications: {
      type: String,
      default: null
    },
    availability: {
      type: [String], 
      default: null
    }
  },
  location: {
    address: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null 
    },
    state: {
      type: String,
      default: null 
    },
    zip: {
      type: String,
      pattern: "^[0-9]{6}$",
      default: null 
    }
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now 
  }
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
