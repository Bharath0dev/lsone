const Notification = require('../models/NotificationsModel');

const anyIsReadTrue = (result) => {
    for (let i = 0; i < result.length; i++) {  
        if (result[i] && result[i].isread === false) {  
            return true;
        }
    }
    return false;
}

exports.getNotifications = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).send({ message: "User ID is required." });
    }

    console.log('Received request with userId:', userId);
    try{
        const result = await Notification.find({receiverId: userId});
        if (result.length === 0) {
            return res.status(200).send({ 
                result: [], 
                isReadStatus: false, 
                message: "No notifications found for this user." 
            });
        }
        const isReadStatus = anyIsReadTrue(result);
        return res.status(200).send({ result, isReadStatus });
    }catch(error){
        console.log('error while finding notifications', error);
        return res.status(500).send({ message: "Internal server error. Please try again later." });
    }
}

exports.updateIsReadStatus = async (req, res) => {
    const {userId} = req.body;

    try{

        // You can update all documents where `isread` is false in a single query
        const result = await Notification.updateMany(
            { isread: false, receiverId: userId },  
            { $set: { isread: true } }  
        );
        
        console.log('Updated documents:', result);

    }catch(error){
        console.log('error while updating isRead status-', error);
    }
}