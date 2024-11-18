const Review = require('../models/reviews');
const User = require('../models/User');

const updateProviderRating = async (providerId, ratingsArray, ratingsCount) => {
    let sum = 0;
    for (let i = 0; i < ratingsArray.length; i++) {
        sum += ratingsArray[i].rating;
    }

    const providerRating = (sum / ratingsCount).toFixed(1);

    try {
        const updated = await User.findOneAndUpdate(
            { _id: providerId },
            { $set: { 'providerDetails.rating': providerRating } },
            { new: true } // Option to return the updated document
        );

        if (!updated) {
            throw new Error('Provider not found');
        }

        console.log(`Provider ${providerId} rating updated to ${providerRating}`);
    } catch (error) {
        console.error('Error updating provider rating: ', error);
    }
};

exports.newReview = async (req, res) => {
    const { customerId, providerId, bookingId, rating, comment } = req.body;
    console.log(customerId, providerId, bookingId, rating, comment);

    try {
        const review = new Review({
            customerId, 
            providerId, 
            bookingId, 
            rating, 
            comment,
        });

        const newReview = await review.save();

        const ratingsArray = await Review.find({ providerId: providerId }, { rating: 1, _id: 0 });
        const ratingsCount = ratingsArray.length;

        if (newReview) {
            await updateProviderRating(providerId, ratingsArray, ratingsCount);
        }

        res.status(201).json({ message: 'Review saved successfully!', status: 'ok', review });
    } catch (error) {
        console.log('Error while saving review: ', error);
        res.status(500).json({ message: 'Error saving review', error: error.message });
    }
};


// exports.getProviderReviews = async(req, res)=>{
//     const {providerId} = req.query;
//     console.log(providerId);

//     try{
//          // Step 1: Fetch reviews for the provider
//          const reviews = await Review.find({ providerId: providerId });

//          // Step 2: Fetch user details for each review
//          const userIds = reviews.map(review => review.customerId); // Extract customerIds
//          const users = await User.find({ _id: { $in: userIds } }); // Fetch users
 
//          // Step 3: Create a mapping of userId to user info
//          const userMap = {};
//          users.forEach(user => {
//              userMap[user._id] = user.name; // Adjust field as necessary
//          });
 
//          // Step 4: Combine reviews with user names
//          const enrichedReviews = reviews.map(review => ({
//              rating: review.rating,
//              comment: review.comment,
//              customerName: userMap[review.customerId] || 'Unknown' // Use the mapping to get names
//          }));
 
//          console.log(enrichedReviews);
//          // Step 5: Send the result
//          res.status(200).json(enrichedReviews);
//     }catch(error){
//         console.log('error while getting provider reviews', error);
//     }
// }

exports.getProviderReviews = async(req, res) => {
    const { providerId } = req.query;
    console.log(providerId);

    try {
        // Step 1: Fetch reviews for the provider
        const reviews = await Review.find({ providerId: providerId });

        // Step 2: Fetch user details for each review
        const userIds = reviews.map(review => review.customerId); // Extract customerIds
        const users = await User.find({ _id: { $in: userIds } }); // Fetch users

        // Step 3: Create a mapping of userId to user info (including profileImage)
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = {
                name: user.name,              // Name of the user
                profileImage: user.profileImage || '',  // Assuming 'profileImage' is the field name
            };
        });

        // Step 4: Combine reviews with user names, profile image, and createdAt (review submission date)
        const enrichedReviews = reviews.map(review => ({
            rating: review.rating,
            comment: review.comment,
            customerName: userMap[review.customerId]?.name || 'Unknown', // Use the mapping to get names
            customerProfileImage: userMap[review.customerId]?.profileImage || '', // If profileImage is missing, use an empty string or a placeholder
            createdAt: review.createdAt, // Assuming 'createdAt' is available in your Review model
        }));

        console.log(enrichedReviews);

        // Step 5: Send the result
        res.status(200).json(enrichedReviews);
    } catch (error) {
        console.log('Error while getting provider reviews', error);
        res.status(500).json({ message: 'Error while fetching reviews' });
    }
}



exports.isBookingReviewed = async (req, res) => {
    const { bookingId } = req.query;
    console.log(bookingId);

    try {
        const result = await Review.findOne({ bookingId: bookingId });
        console.log(result);
        
        if (result) {
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (error) {
        console.log('Error while checking if the booking has already been reviewed:', error);
        res.status(500).send('Internal Server Error'); // Send a server error response
    }
};
