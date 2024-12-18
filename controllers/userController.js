const Booking = require('../models/Booking');
const User = require('../models/User'); 
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Availability = require('../models/availabilityModel');


// exports.updateUser = async (req, res) => { 

//     const { name, email, mobile, role, address} = req.body;

//     const profileImagePath = req.files.image ? req.files.image[0].path : null;

//     const serviceImages = req.files['providerServiceImages'] || [];

//     const existingUser = await User.findOne({ email: email });
//     const currentProfileImage = existingUser.profileImage;

//     const finalProfileImagePath = profileImagePath || currentProfileImage;


//     console.log(req.body);

//     try{
//         if( role == 'Customer'){
//             await User.updateOne({
//                 email: email
//             },{
//                 $set: {
//                     name, 
//                     mobile, 
//                     email, 
//                     role, 
//                     'location.address':address, 
//                     'location.city':city, 
//                     'location.zip':zipcode, 
//                     profileImage: finalProfileImagePath,
//                 },
//             })
//         }
//         else if(role == 'ServiceProvider'){

//             const existingImages = await User.findOne(
//                 { email: email },
//                 { 'providerDetails.providerServiceImages': 1 }
//             );
//             console.log(existingImages.providerDetails.providerServiceImages);

//             // console.log('finalProfileImagePath: ',finalProfileImagePath);
//             // (existingImages.providerDetails.providerServiceImages).filter((imageFileName)=>{
//             //     console.log('image String is: ',imageFileName);
//             //     const imageString = imageFileName
//             // })

//             if (existingImages && existingImages.providerDetails && existingImages.providerDetails.providerServiceImages) {
//                 await User.updateOne(
//                     { email: email },
//                     {
//                         $push: {
//                             'providerDetails.providerServiceImages': { $each: serviceImages.map(img => img.path) },
//                         },
//                         $set: {
//                             name, 
//                             mobile, 
//                             email, 
//                             role, 
//                             address: address, 
//                             // 'location.city': city, 
//                             // 'location.zip': zipcode,
//                             profileImage: finalProfileImagePath,
//                         },
//                     }
//                 );
//             } else{
//                 await User.updateOne({
//                     email: email
//                 },{
//                     $set: {
//                         name, 
//                         mobile, 
//                         email, 
//                         role, 
//                         address: address, 
//                         // 'location.city':city, 
//                         // 'location.zip':zipcode,
//                         profileImage: profileImagePath,
//                         providerDetails : {
//                             providerServiceImages: serviceImages.map(img => img.path)
//                         },
//                     },
//                 })
//             }
//         }
        

//         res.send({ status: 'ok', data: 'updated' });
//     }catch(error){
//         console.log(error);
//         return res.send({error: error});
//     }
// }; 
 

exports.updateUser = async (req, res) => { 

    const { name, email, mobile, role, address } = req.body;

    const profileImagePath = req.files.image ? req.files.image[0].path : null;
    console.log(req.files['providerServiceImages']);
    const serviceImages = req.files['providerServiceImages'] || [];
    console.log(serviceImages);

    const existingUser = await User.findOne({ email: email });
    const currentProfileImage = existingUser.profileImage;

    const finalProfileImagePath = profileImagePath || currentProfileImage;

    // console.log(req.body);

    try {
        if (role == 'Customer') {
            // For 'Customer' role, update name, mobile, email, role, and address details
            await User.updateOne({
                email: email
            },{
                $set: {
                    name, 
                    mobile, 
                    email, 
                    role, 
                    address: address, 
                    profileImage: finalProfileImagePath,
                },
            });
        }
        else if (role == 'ServiceProvider') {
            if (serviceImages.length > 0) {
                // If serviceImages is not empty, we proceed with adding images
                const existingImages = await User.findOne(
                    { email: email },
                    { 'providerDetails.providerServiceImages': 1 }
                );
                console.log(existingImages.providerDetails.providerServiceImages);
                // console.log("kyaa-",existingImages);

                if (existingImages && existingImages.providerDetails && existingImages.providerDetails.providerServiceImages) {
                    // If the user already has service images, append the new ones
                    await User.updateOne(
                        { email: email },
                        {
                            $push: {
                                'providerDetails.providerServiceImages': { $each: serviceImages.map(img => img.path) },
                            },
                            $set: {
                                name, 
                                mobile, 
                                email, 
                                role, 
                                address: address, 
                                profileImage: finalProfileImagePath,
                            },
                        }
                    );
                } else {
                    // If the user doesn't have service images, initialize providerDetails with new images
                    await User.updateOne({
                        email: email
                    },{
                        $set: {
                            name, 
                            mobile, 
                            email, 
                            role, 
                            address: address, 
                            profileImage: finalProfileImagePath,
                            providerDetails: {
                                providerServiceImages: serviceImages.map(img => img.path)
                            },
                        },
                    });
                }
            } else {
                // If serviceImages is empty, update only the basic fields (no provider images)
                // console.log('kya2',req.body, finalProfileImagePath);
                await User.updateOne({
                    email: email
                },{
                    $set: {
                        name, 
                        mobile, 
                        email, 
                        role, 
                        address: address, 
                        profileImage: finalProfileImagePath,
                    },
                });
            }
        }

        // res.send({ status: 'ok', data: 'updated' });
        res.status(200).json({ status: 'ok', message: 'User updated successfully' });

    } catch (error) {
        console.log('Error updating user:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    
    }
};



exports.getAllUsers = async (req, res) => { 
    try{
        const users = await User.find({});

        // If no users are found, send a message indicating this
        if (users.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No users found'
            });
        }

        console.log('All users retrieved:', users);
        return res.status(200).json({
            status: 'ok',
            data: users
        });


    }catch(error){
        console.log('Error fetching users:', error);
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching users.',
            error: error.message
        });
    }
}; 

exports.getUserData = async (req, res) => {
    const { role } = req.query;

    // Input validation
    if (!role) {
        console.log('Role parameter is required');
        return res.status(400).json({ status: 'error', message: 'Role parameter is required' });
    }


    try{
        const dataCount = await User.find({role});
        const count = dataCount.length;

        const userData = await User.find({
            role,
            accountStatus: { $in: ['active', 'deactivated'] }
        });

        console.log(userData)
        return res.status(200).json({ status: 'ok', data: userData, count });

    }catch(error){
        console.log('Error while fetching user data:', error);

        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching user data. Please try again later.',
            error: error.message
        });
    }
}

exports.getProviderData = async (req, res)=>{
    const { role } = req.query;

     // Input validation
     if (!role) {
        console.log('Role parameter is required');
        return res.status(400).json({ status: 'error', message: 'Role parameter is required' });
    }


    try {
        // Find users with the specified role and active accountStatus
        const data = await User.find({ role, accountStatus: 'active' });

        // Get the count of users
        const count = data.length;

        console.log('Found active users with role:', role, data);

        return res.status(200).json({ status: 'ok', data, count });

    } catch (error) {
        console.error('Error while fetching provider data:', error);
        return res.status(500).json({ status: 'error', message: 'An error occurred while fetching the provider data. Please try again later.' });
    }
}

// exports.deleteUser = async (req, res)=>{
//     const {id}=req.body;
//     try{
//         await User.deleteOne({_id:id});
//         res.send({status: 'ok', data: 'User-deleted'});
//     }catch(error){
//         return res.send({error: error});
//     }
// }

exports.deactivateUser = async(req, res) => {
    const {id}=req.body;

    // Validate input
    if (!id) {
        console.log('User ID is required');
        return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }

    try{
        // Find user and update accountStatus to 'deactivated'
        const result = await User.findOneAndUpdate(
            { _id: id },
            { $set: { accountStatus: 'deactivated' } },
            { new: true } // Return the updated document
        );

        if (!result) {
            console.log(`No user found with ID: ${id}`);
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        console.log(`User with ID: ${id} has been deactivated.`);
        return res.status(200).json({ status: 'ok', data: 'User deactivated successfully' });
  
    }catch(error){
        console.error('Error while deactivating user:', error);
        return res.status(500).json({ status: 'error', message: 'An error occurred while deactivating the user. Please try again later.' });
   
    }
}

exports.deleteProviderServiceImage = async (req, res)=>{
    const {userId, image} = req.body;
    console.log(image, userId);

    try{
        const result = await User.updateOne(
            { _id: userId}, 
            { $pull: {'providerDetails.providerServiceImages': image}}
        )

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Image not found or user not found' });
          }

        return res.status(200).json({ message: 'Image deleted successfully' });
    }catch(error){
        console.error('Error deleting image:', error);
        return res.status(500).json({ message: 'Error deleting image' });
    }
}

exports.getProviderDetails = async (req, res)=>{
    const {providerId} = req.query;

    // Check if providerId is provided
    if (!providerId) {
        return res.status(400).json({ error: 'Provider ID is required' });
    }

     // Validate that providerId is a valid MongoDB ObjectId
     if (!mongoose.Types.ObjectId.isValid(providerId)) {
        return res.status(400).json({ error: 'Invalid provider ID' });
    }

    try{
        const result = await User.findById(providerId);
        if (!result) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        // Respond with the provider data
        return res.status(200).json({ data: result });
    }catch(error){
        console.error('Error while getting provider data:', error);

        // Respond with a 500 server error and a generic message
        return res.status(500).json({ error: 'An error occurred while retrieving provider details. Please try again later.' });
    }
}

exports.getRegistrationRequests = async (req, res) => {

    try{
        const result = await User.find({accountStatus: 'inactive'});
        const count = await User.countDocuments({ accountStatus: 'inactive' });
        console.log('Inactive users found:', result.length, 'Count:', count);

        // Send the result and count in the response
        return res.status(200).json({ result, count });
    }catch(error){
        console.log('error while finding inative users-', error);
        // Respond with a 500 status code and error message
        return res.status(500).json({
            error: 'An error occurred while retrieving registration requests. Please try again later.'
        });
    }
}


exports.updateAccountStatus = async (req, res) => {
    const { statusResponse, providerId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(providerId)) {
        return res.status(400).send({ message: 'Invalid providerId' });
    }

    if (statusResponse !== 'approved' && statusResponse !== 'rejected') {
        return res.status(400).send({ message: 'Invalid statusResponse. It must be "approved" or "rejected".' });
    }

    try {
        let accountStatus = '';
        
        if (statusResponse === 'approved') {
            accountStatus = 'active';
        } else if (statusResponse === 'rejected') {
            accountStatus = 'rejected';
        }

        const result = await User.findOneAndUpdate(
            { _id: providerId },
            { $set: { accountStatus } },
            { new: true } 
        );

        if (!result) {
            return res.status(404).send({ message: 'Provider not found' });
        }

        res.status(200).send({ result });

    } catch (error) {
        console.log('Error while updating account status:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

exports.updateOnHoldProviderData = async (req, res) => {
    const {address, experience, email, services, description} = req.body;

    // Validate input data
    if (!address || !experience || !email || !description) {
        console.log('Missing required fields: address, experience, email, or description');
        return res.status(400).json({ status: 'error', message: 'All fields are required (address, experience, email, description)' });
    }

    try{
                // Find the user by email and update the provider data
        const result = await User.findOneAndUpdate(
            { email: email },
            { 
                $set: { 
                    address: address, 
                    'providerDetails.experience': experience, 
                    'providerDetails.preferences': services, 
                    'providerDetails.description': description 
                } 
            },
            { new: true } // Return the updated document
        );

        if (result) {
            console.log('Provider data updated successfully:', result);
            return res.status(200).json({ result, status: 'ok' });
        } else {
            console.log('No provider found with the given email:', email);
            return res.status(404).json({ status: 'error', message: 'Provider not found with the given email' });
        }

    }catch(error){
        console.log('error while updateOnHoldProviderData-', error);
        return res.status(500).json({ status: 'error', message: 'An error occurred while updating the provider data. Please try again later.' });

    }
}

// exports.getCountforProviderScreen = async (req, res) => {
//     const { userId } = req.query;
//     console.log('userId for getCount-',userId);
//     try{
//         const pendingRequests = await Booking.find({providerId: userId, status: 'pending'});
//         const upComingTasks = await Booking.find({providerId: userId, status: 'confirmed'});
//         const optedServices = await Service.find({}, {serviceProviderId:1, _id:0});
//         const pendingRequestsCount = pendingRequests.length;
//         const upComingTasksCount = upComingTasks.length;
//         // const optedServicesCount = optedServices.length;
//         console.log('pending count-',pendingRequestsCount);
//         console.log('upcoming count-',upComingTasksCount);

//         let count = 0;
//         for(let i=0; i< optedServices.length; i++){
//             console.log(optedServices[i].serviceProviderId);
//         }

//         console.log('optedServices-',optedServices);
//         // console.log('optedServices count-',optedServicesCount);
//     }catch(error){
//         console.log('error while getting counts-', error);
//     }
// }

exports.getCountforProviderScreen = async (req, res) => {
    const { userId } = req.query;
    console.log('userId for getCount-', userId);
    try {
        const pendingRequests = await Booking.find({ providerId: userId, status: 'pending' });
        const upComingTasks = await Booking.find({ providerId: userId, status: 'confirmed' });
        const optedServices = await Service.find({}, { serviceProviderId: 1, _id: 0 });
        const unAvalableDates = await Availability.findOne({providerId: userId}, {unAvailableDates:1, _id:0});

        const pendingRequestsCount = pendingRequests.length;
        const upComingTasksCount = upComingTasks.length;

        const today = new Date();
        const isoString = today.toISOString(); // Get the ISO string format (e.g., "2024-11-13T09:55:23.767Z")
        console.log(isoString);

        // Split the string at the 'T'
        const [date, time] = isoString.split('T');

        console.log('Date:', date);

        let unAvailableDatesCount = 0;

        // for(let i=0;i<unAvalableDates.unAvailableDates.length; i++){
        //     if(unAvalableDates.unAvailableDates[i] >= date){
        //         unAvailableDatesCount++;
        //     }
        // }

        // Check if unAvailableDates exists and is an array
        if (unAvalableDates && Array.isArray(unAvalableDates.unAvailableDates)) {
            // Count how many unavailable dates are greater than or equal to today's date
            for (let i = 0; i < unAvalableDates.unAvailableDates.length; i++) {
                if (unAvalableDates.unAvailableDates[i] >= date) {
                    unAvailableDatesCount++;
                }
            }
        } else {
            console.log('No unavailable dates found for provider');
        }


        console.log(unAvailableDatesCount);

        console.log('pending count-', pendingRequestsCount);
        console.log('upcoming count-', upComingTasksCount);

        let matchingServiceProviderCount = 0;

        // Loop through each optedService and check if the userId matches any serviceProviderId
        for (let i = 0; i < optedServices.length; i++) {
            // Check if the serviceProviderId array contains the userId
            for (let j = 0; j < optedServices[i].serviceProviderId.length; j++) {
                if (optedServices[i].serviceProviderId[j].toString() === userId) {
                    matchingServiceProviderCount++;
                    break;  // Exit the inner loop as we found a match
                }
            }
        }

        console.log('Matching serviceProviderId count:', matchingServiceProviderCount);

        res.status(200).json({
            pendingRequestsCount,
            upComingTasksCount,
            matchingServiceProviderCount,
            unAvailableDatesCount
        });

    } catch (error) {
        console.log('Error while getting counts-', error);
        res.status(500).json({ message: 'Error while fetching counts' });
    }
};
