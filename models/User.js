const mongoose = require('mongoose');
const path = require('path');

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
  profileImage:{
    type: String,
    default: null,
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
    providerServiceImages:{
      type: [String],
      default: null,
    },
    experience: {
      type: String,
      default: null
    },
    availability: {
      type: [String], 
      default: null
    },
    preferences: String,
    description: String,
    rating: {
      type: String,
      default: null
    },
  },
  
  // location: {
  //   address: {
  //     type: String,
  //   },
  //   city: {
  //     type: String, 
  //   },
  //   state: {
  //     type: String,
  //   },
  //   zip: {
  //     type: String,
  //     pattern: "^[0-9]{6}$",
  //   }
  // },
  address: {
    type: String,
    default: null,
  },
  accountStatus:{
    type: String,
    enum: ['active', 'inactive','rejected', 'deactivated'],
    required: true,
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
