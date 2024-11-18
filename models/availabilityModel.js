const mongoose = require('mongoose');

// const timingSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

// const availabilitySchema = new mongoose.Schema({
//     providerId :{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Users',
//     },
//     dates:[
//         {
//             date:{
//                 type: String,
//                 // required: true,
//             },
//             time:{
//                 type: [String],
//                 // enum: timingSlots,
//                 // default: timingSlots, 
//                 // required: true
//             }
//         }
//     ]
// });


const availabilitySchema = new mongoose.Schema({
    providerId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    unAvailableDates: {
        type: [String],
    }
});

const Availability = mongoose.model('availabity', availabilitySchema);

module.exports = Availability;