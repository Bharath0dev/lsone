const Availability = require('../models/availabilityModel');

exports.getProviderUnAvailability = async(req, res) => {
    const {providerId} = req.query;

    try{
        const result = await Availability.findOne({providerId: providerId})
        console.log(result);
        console.log(result.unAvailableDates);

        return res.status(200).json(result.unAvailableDates);
    }catch(error){
        console.log('error while getting provider unAvaialbility', error);
    }
}

exports.updateAvailability = async(req, res) => {
    const {unAvailabilityDates, providerId} = req.body;
    console.log(req.body);
    try{
        const result = await Availability.findOne({providerId:providerId});
        console.log(result);
        if(!result){
            const newAvailability = new Availability({
                providerId: providerId,
                unAvailableDates: unAvailabilityDates, // Set the unavailability dates
            });
            await newAvailability.save();
            return res.status(201).json({ message: 'Availability created', availability: newAvailability });
        
        }
        else {
            // Document found, update the existing availability
            result.unAvailableDates = unAvailabilityDates; // Update with new dates
            await result.save();
            return res.status(200).json({ message: 'Availability updated', availability: result });
        }


    }catch(error){
        console.log('Error while updating unavaialability dates',error);
    }
}

exports.getDatesToHide = async (req, res) => {
    const { providerId } = req.query;

    try{
        const result = await Availability.findOne({ providerId : providerId }, {unAvailableDates:1, _id:0})
        console.log(result);
        res.send(result);
    }catch(error){
        console.log('error while getting the dates to hide in the backend', error)
    }
}