const Availability = require('../models/availabilityModel');


let count = 0;
async function updateDateObject(providerId, targetDate, newDateObject) {
    try {
        const result = await Availability.updateOne(
            { providerId, 'dates.date': targetDate }, 
            { 
                $set: { 
                    'dates.$.date': newDateObject.date,
                    'dates.$.time': newDateObject.time
                } 
            }
        );
        console.log('updated');
        const test = result.modifiedCount > 0;
        console.log(test);
        console.log(typeof(test));

        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating date object:', error);
        return false;
    }
}

const createNewAvailability = async (req, providerId, dates) => {
    try{
        const newAvailability = new Availability({ providerId, dates });
        const savedAvailability = await newAvailability.save();

        console.log(savedAvailability);
        console.log('created');
        return savedAvailability;
    } catch (error) {
        console.error('Error creating availability:', error);
        throw new Error('Error creating availability');
    }
}

exports.createAvailability = async (req, res) => {
    try {
        const { providerId, dates } = req.body;

        if( !providerId || !dates ){
            return res.status(400).json({ error: 'data missing' });
        }

        const dateFromDates = dates[0].date;
        const dateObjectFromDates = dates[0];
        
        const existingAvailability = await Availability.findOne({ providerId },{});
        if (existingAvailability) {
            for (const dateObj of existingAvailability.dates)  {
                if(dateFromDates == dateObj.date){
                    // console.log('same same');
                    count=count+1;
                    console.log(count);
                    const updated = await updateDateObject(providerId, dateFromDates, dateObjectFromDates);
                    if (updated) {
                        return res.status(200).json({ message: 'Date and time updated successfully' });
                    } else {
                        return res.status(404).json({ error: 'No matching date object found or already updated' });
                    }
                }
            };

            const savedAvailability = await createNewAvailability(req, providerId, dates);
            return res.status(200).json({
                message: 'Success',
                data: savedAvailability
            });
        } else {
            console.log('No existing availability found for this provider.');
            const savedAvailability = await createNewAvailability(req, providerId, dates);

            return res.status(201).json({
                message: 'Availability created successfully',
                data: savedAvailability
            });
        }
        // const newAvailability = new Availability({ providerId, dates });
        // const savedAvailability = await newAvailability.save();

        // console.log(savedAvailability);
        
        // res.status(201).json(savedAvailability);
        // createNewAvailability(providerId, dates);

    } catch (error) {
        res.status(400).json({ error: 'Error creating availability' });
    }
}


exports.getProviderAvailability = async (req, res) => {
    try{
        const { providerId } = req.query;

        if(!providerId){
            return res.status(400).json({ error: 'data missing' });
        }

        const providerAvailability = await Availability.find({providerId})
        console.log(providerAvailability);
        res.send(providerAvailability);

    }catch(error){
        console.log('error white getting Provider availability', error);
    }
}

exports.removeDate = async (req, res) => {
    try{
        const {providerId, date} = req.body;
        console.log(providerId);
        console.log(date);

        if(!date || !providerId){
            return res.status(400).json({ error: 'data missing' });
        }

        const updatedDocument = await Availability.findOneAndUpdate(
            {providerId, 'dates.date': date},
            { $pull: { dates: {date}}},
            { new: true } 
        )

        if(!updatedDocument){
            return res.status(404).json({ error: 'Provider or date not found' });
        }

        return res.status(200).json({ message: 'Date removed successfully', updatedDocument });

        

    }catch(error){
        console.log('error while deleting date: ', error);
    }
}

exports.removeTime = async (req, res) => {
    try{
        const {providerId, date, time} = req.body;
        console.log(providerId, date, time);

        if(!providerId || !date || !time){
            return res.status(400).json({ error: 'data missing' });
        }

        const result = await Availability.updateOne(
            { providerId, 'dates.date': date },
            { $pull: { 'dates.$.time': time } }
        );

        if (result.Modified === 0) {
            return res.status(404).json({ message: 'No time slot found for the specified date.' });
        }

        return res.status(200).json({ message: 'Time removed successfully.' });
    
    }catch(error){
        console.log('error while removing time: ', error);
    }
}

exports.getTimings = async(req, res) => {
    try{

        const {providerId, date} = req.query;

        if(!providerId || !date){
            return res.status(400).json({ error: 'data missing' });
        }

        console.log(providerId, date);

        const result = await Availability.find({providerId})
        console.log(result);

        const matchingTimings = result.reduce((acc, item) => {
            const foundTimes = item.dates
                .filter(d => d.date === date) // Filter for matching date
                .flatMap(d => d.time); // Extract and flatten the times array
            
            return acc.concat(foundTimes); // Concatenate found times to the accumulator
        }, []);

        if (matchingTimings.length === 0) {
            console.log('no time to die');
            return res.status(404).json({ error: 'No timings found for this date' });
        }

        console.log(matchingTimings);

        return res.status(200).json({ timings: matchingTimings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}