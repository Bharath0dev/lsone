const Booking = require('../models/Booking'); 
const User = require('../models/User');
const Notification = require('../models/NotificationsModel');
const Service = require('../models/Service');
const Availability = require('../models/availabilityModel');


function generateRandomString(length) {
    const characters = '0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    
    return result;
}

const updateCustomerAddress = async (customerId, location) => {
    const updatedAddress = await User.findOneAndUpdate(
        {_id: customerId}, 
        {$set: { address: location}}
    );

    if(updatedAddress){
        return true;
    }
    else{
        throw new Error("Failed to update address");
    }
}

exports.newBooking = async (req, res) => { 
    const { serviceId, providerId, customerId, scheduled_Date, preferredTime, location} = req.body;

    const customerData = await User.findById(customerId, {name:1, address:1, _id:0});
    const customerName = customerData.name;
    const customerAddress = customerData.address;
    console.log(customerName);

    if(!customerAddress){
        try {
            const updatedAddress = await updateCustomerAddress(customerId, location);
            if (!updatedAddress) {
                return res.status(500).send({ error: "Failed to update customer address" });
            }
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    }
    console.log(customerAddress);

    // const providerData = await User.findById(providerId, {name:1, _id:0});
    // console.log(providerData);

    const serviceData = await Service.findById(serviceId, {serviceName:1, _id:0});
    const serviceName = serviceData.serviceName;
    console.log(serviceName);


    let scheduledDate = '';
    if(scheduled_Date){
        scheduledDate = scheduled_Date.split('T')[0];
    }

    let genBookingId = generateRandomString(8);
    console.log('booking id: ',genBookingId);

    const oldRandomBookingId = await Booking.find({bookingId: genBookingId})

    if(oldRandomBookingId === genBookingId){
        genBookingId = generateRandomString(8);
        console.log('revised booking id: ',genBookingId);
    }

    if(!serviceId || !providerId || !customerId || !scheduled_Date || !location){
        return res.status(404).send({message: 'data missing'});
    }

    console.log('providerId is: ',providerId);
    console.log('serviceId is: ',serviceId);
    console.log('customerId is: ',customerId);
    console.log('scheduled date is: ',scheduledDate);


    try{
        await Booking.create({
            serviceId,
            providerId,
            customerId,
            bookingId: genBookingId,
            scheduledDate: scheduledDate,
            preferredTime: preferredTime,
            location: location,
        });

        await Notification.create({
            receiverId: providerId,
            heading: `New Booking`,
            message: `You got a booking from ${customerName} for ${serviceName}. For more details refer bookingId: ${genBookingId}`,
        })
        
        res.send({ status: 'ok', data:'Booking added'})
    }catch(error){
        console.log(error);
        res.status(500).send({ error: "Failed to create booking" });
    }
}; 
 
exports.bookingDataByUserId = async(req, res)=>{
    const { userId } = req.params;
    console.log(userId);

    try{

        const user = await User.findOne({_id:userId}, {_id:0, role:1});

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(user.role);
        userRole = user.role;

        let bookings, count;

        if(userRole === 'Customer'){
            bookings = await Booking.find({ customerId: userId })
            .select('status scheduledDate preferredTime serviceId bookingId')
            .populate({
                path:'providerId',
                select: 'name email role'
            })
            .sort({ createdAt: -1 });
            
            // console.log(bookings);

            res.json({bookings});
        }else if(userRole === 'ServiceProvider'){
            bookings = await Booking.find({ providerId: userId })
            .select('status scheduledDate preferredTime serviceId bookingId')
            .populate({
                path:'customerId',
                select: 'name email role'
            })
            .sort({ createdAt: -1 });

            // count = {
            //     thisMonth: await Booking.countDocuments({
            //         providerId: userId,
            //         status: 'completed', // Add status filter
            //         scheduledDate: {
            //             $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            //             $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            //         }
            //     }),
            //     lastMonth: await Booking.countDocuments({
            //         providerId: userId,
            //         status: 'completed', // Add status filter
            //         scheduledDate: {
            //             $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            //             $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            //         }
            //     }),
            //     lastThreeMonths: await Booking.countDocuments({
            //         providerId: userId,
            //         status: 'completed', // Add status filter
            //         scheduledDate: {
            //             $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1),
            //             $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            //         }
            //     }),
            //     thisYear: await Booking.countDocuments({
            //         providerId: userId,
            //         status: 'completed', // Add status filter
            //         scheduledDate: {
            //             $gte: new Date(new Date().getFullYear(), 0, 1),
            //             $lt: new Date(new Date().getFullYear() + 1, 0, 1)
            //         }
            //     })
            // };


            // console.log(bookings);

            res.json({ bookings });
        }

    }catch(error){
        console.log('booking error:', error)
    }
}

const sendNotifications = async (userResponse, providerId, customerId, genBookingId, serviceId) => {
    console.log('sendNotifications abc');
    try{
        const providerName = await User.find({_id:providerId}, {name:1, _id:0});
        const customerName = await User.find({_id:customerId}, {name:1, _id:0});
        const serviceName = await Service.find({_id:serviceId}, {serviceName:1, _id:0});

        if(userResponse === 'cancelled'){
            await Notification.create({
                receiverId: providerId,
                heading: `Booking Cancelled`,
                message: `Your booking is cancelled by ${customerName} for ${serviceName}. For more details refer bookingId: ${genBookingId}`,
            })
        }
        if(userResponse === 'confirmed'){
            await Notification.create({
                receiverId: customerId,
                heading: `Booking Confirmed`,
                message: `Your booking has been accepted by ${providerName} for ${serviceName}. For more details refer bookingId: ${genBookingId}`,
            })
        }
        if(userResponse === 'completed'){
            await Notification.create({
                receiverId: customerId,
                heading: `Booking Completed`,
                message: `Your booking has been completed by ${providerName} for ${serviceName}. For more details refer bookingId: ${genBookingId}`,
            })
        }

    }catch(error){
        console.log('error while saving notifiaction content in db-', error);
    }

}


exports.updateBookingStatusByBookingIdAndUserResponse = async (req, res)=> {
    const { userResponse, scheduledDate, providerId, customerId, genBookingId, serviceId } = req.body;
    console.log(req.body);

    console.log(req.params.id);
    if (!['confirmed', 'cancelled', 'declined', 'completed'].includes(userResponse)) {
        return res.status(400).json({ error: 'Invalid status value.' });
    }

    try{   

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            {status: userResponse, updatedAt: Date.now()},
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        sendNotifications(userResponse, providerId, customerId, genBookingId, serviceId);

         // Split the scheduledDate at the 'T' to extract the date part
         const dateParts = scheduledDate.split('T');
         const dateOnly = dateParts[0];

         console.log('Scheduled Date (Date Only):', dateOnly);

         const document = await Availability.findOne({providerId: providerId});
         console.log(document);

        if ( userResponse == 'confirmed' ) {

            await document.updateOne({ 
            $push: { unAvailableDates: dateOnly }
            });

        }else if (userResponse === 'completed'){

            await document.updateOne({ 
            $pull: { unAvailableDates: dateOnly }
            });

        }

        res.status(200).json({ message: 'Booking status updated successfully.', booking });
    
    }catch(error){
        console.log("booking status update error: ", error);
    }
}

exports.bookingDataBycustomerIdAndProviderId = async (req, res) => {
    const {customerId, serviceId, providerId} = req.query;
    console.log(req.query);

    try{
        const result = await Booking.findOne({
            customerId: customerId, 
            serviceId: serviceId, 
            providerId: providerId,
            status: "pending",
        },{_id:1})

        if(!result){
            console.log('em ledhu dolla',result);
            res.send({status: 'noData'});
        }else{
            console.log('result of bookingDataBycustomerIdAndProviderId-',result);
            res.send({status: 'yes'});
        }
    }catch(error){
        console.log('error while getting bookingDataBycustomerIdAndProviderId-', error);
    }
}

exports.getBookingCount = async (req, res) => {
    try{
        const result = await Booking.find({});
        const count = result.length;

        res.send({count});
    }catch(error){
        console.log('error while getting bookings count-', error);
    }
}



// const handleCheckDateById = async (id) => {
//     try {
//         const booking = await Booking.findById(id, { scheduledDate: 1, _id: 0, scheduledTime: 1 });

//         if (!booking) {
//             throw new Error('Booking not found');
//         }

//         return booking; 
//     } catch (error) {
//         console.error('Error fetching booking:', error);
//         throw error; 
//     }
// };


// exports.updateBookingStatusByBookingIdAndUserResponse = async (req, res)=> {
//     const { userResponse } = req.body;
//     console.log(req.body);

//     if (!['confirmed', 'canceled', 'declined', 'completed'].includes(userResponse)) {
//         return res.status(400).json({ error: 'Invalid status value.' });
//     }

//     try{

//         if(userResponse === 'completed'){
//             const booking = await handleCheckDateById(req.params.id);
//             console.log(booking);
            
//             const { scheduledDate, scheduledTime } = booking;

//             // Convert scheduledDate to a Date object if it isn't already
//             const date = scheduledDate instanceof Date ? scheduledDate : new Date(scheduledDate);
//             const scheduledDateTime = new Date(date); // Create a new Date object based on scheduledDate

//             // Parse scheduledTime
//             const [time, modifier] = scheduledTime.split(' '); // Split time and AM/PM
//             const [hours, minutes] = time.split(':').map(Number);

//              // Adjust hours based on AM/PM
//              if (modifier === 'PM' && hours < 12) {
//                 scheduledDateTime.setHours(hours + 12);
//             } else if (modifier === 'AM' && hours === 12) {
//                 scheduledDateTime.setHours(0); // Set to midnight
//             } else {
//                 scheduledDateTime.setHours(hours);
//             }
//             scheduledDateTime.setMinutes(minutes); // Set minutes

//              // Get current date and time
//              const currentDateTime = new Date();

//              // Compare the scheduled date and time with the current date and time
//              if (currentDateTime > scheduledDateTime) {
//                  console.log("The scheduled time has passed.");
//                  // Handle logic for when the scheduled time has passed
//              } else {
//                  console.log("The scheduled time is in the future.");
//                  // Handle logic for when the scheduled time is in the future
//              }
 
//              console.log(scheduledDateTime, currentDateTime); // For debugging
 
//              return res.send("got");
//         }

//         // const booking = await Booking.findByIdAndUpdate(
//         //     req.params.id,
//         //     {status: userResponse, updatedAt: Date.now()},
//         //     { new: true }
//         // );

//         // if (!booking) {
//         //     return res.status(404).json({ error: 'Booking not found.' });
//         // }

//         // res.status(200).json({ message: 'Booking status updated successfully.', booking });
    
//     }catch(error){
//         console.log("booking status update error: ", error);
//     }
// }