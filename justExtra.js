const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const app=express();

require('./config/db.js');

const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const serviceRoutes = require('./routes/serviceRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes'); 
 


app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/services', serviceRoutes); 
app.use('/api/bookings', bookingRoutes); 

app.get('/', (req, res)=>{
    res.send({status:'started'})
})

app.post('/register', async (req, res)=>{
    const { name, email, mobile, password, role }=req.body;
    

    const oldUser= await User.findOne({email:email})

    if(oldUser){
        return res.send({ data: 'User already exist'});
    }

    const encrypetedPassword = await bcrypt.hash(password, 10)

    try{
        await User.create({
            name:name,
            email:email,
            mobile,
            password: encrypetedPassword,
            role,
        });
        res.send({status:'ok', data: 'user created'})
    }catch(error){
        res.send({ status:'error', data: error})
    }

})


app.post('/login-user', async (req,res)=>{
    const {email, password} = req.body;

    const oldUser = await User.findOne({ email: email });

    if(!oldUser){
        return res.send({data: "User doesn't exist"});
    }

    if(await bcrypt.compare(password, oldUser.password)){
        const token = jwt.sign({email:oldUser.email}, JWT_SECRET);
        return res.send({ status: 'ok', data: token, role: oldUser.role, userId: oldUser._id });
    }
    else{
        return res.send({ status: "error" });
    }
    
})

app.post('/userdata', async (req, res)=>{
    const { token, userId } = req.body;

    try{
        const user = jwt.verify(token, JWT_SECRET);
        const useremail = user.email;

        User.findOne({email: useremail}).then((data)=>{
            return res.send({ status: 'ok', data: data});
        });
    }catch(error){
        return res.send({error: error});
    }

})

app.post('/update', async (req, res) => {
    const { name, email, mobile, role, address, city, zipcode} = req.body;
    console.log(req.body);
    try{
        if( role == 'Customer'){
            await User.updateOne({
                email: email
            },{
                $set: {
                    name, mobile, email, role, 'location.address':address, 'location.city':city, 'location.zip':zipcode, 
                },
            })
        }
        else if(role == 'ServiceProvider'){
            await User.updateOne({
                email: email
            },{
                $set: {
                    name, mobile, email, role, 'location.address':address, 'location.city':city, 'location.zip':zipcode,
                },
            })
        }
        

        res.send({ status: 'ok', data: 'updated' });
    }catch(error){
        return res.send({error: error});
    }
})

// app.post('/update-provider', async (req, res) => {
//     const { name, email, mobile, role, street, category, services} = req.body;
//     console.log(req.body);
//     try{
        

//         res.send({ status: 'ok', data: 'updated' });
//     }catch(error){
//         return res.send({error: error});
//     }
// })

app.get('/get-all-user', async (req, res)=>{
    try{
        const data = await User.find({});
        res.send({status: 'ok', data: data});
    }catch(error){
        return res.send({error: error});
    }
})

app.get('/get-user-data', async (req, res)=>{
    const { role } = req.query;
    try{
        const data = await User.find({role});
        console.log(data)
        res.send({status: 'ok', data: data});

    }catch(error){
        return res.send({error: error});
    }
})


app.get('/getProviderData', async (req, res)=>{
    const { role } = req.query;
    try{
        const data = await User.find({role});
        console.log(data)
        res.send({status: 'ok', data: data});

    }catch(error){
        return res.send({error: error});
    }
})

// app.get('/get-Admin-data', async (req, res)=>{
//     try{
//         const data = await User.find({role:'Admin'});
//         res.send({status: 'ok', data: data});
//     }catch(error){
//         return res.send({error: error});
//     }
// })


app.post('/delete-user', async (req, res)=>{
    const {id}=req.body;
    try{
        await User.deleteOne({_id:id});
        res.send({status: 'ok', data: 'User-deleted'});
    }catch(error){
        return res.send({error: error});
    }
})



app.post('/new-service', async (req, res)=>{
    const { serviceName, description, category } = req.body;

    try{
        await Service.create({
            serviceName:serviceName,
            description,
            category
        });
        res.send({ status: 'ok', data:'Service added'})

    }catch(error){
        return res.send({ error: error });
    }
})

app.get('/get-services-ad', async (req, res)=>{
    
    try{
        const data = await Service.find({});
        res.send({status: 'ok', data: data})
    }catch(error){
        return res.send({ error: error });
    }
})

app.get('/get-services', async (req, res)=>{
    const { category } = req.query;
    try{
        const data = await Service.find({category});
        res.send({status: 'ok', data: data})
    }catch(error){
        return res.send({ error: error });
    }
})

app.get('/services', async (req, res)=>{
    try {
        const services = await Service.find({}); // Fetch all services
        const categories = [...new Set(services.map(service => service.category))]; // Extract unique categories

        // Categorize services
        const categorizedServices = categories.reduce((acc, category) => {
            acc[category] = services.filter(service => service.category === category);
            return acc;
        }, {});

        return res.status(200).json({ categories, categorizedServices });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
})


app.post('/services/:serviceId/provider', async (req, res) => {
    const { serviceId } = req.params; // Get service ID from the request params
    const { providerId } = req.body;   // Get provider ID from the request body

    console.log( serviceId );
    try {
        // Validate input
        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }

        // Find the service by ID and update it
        // const service = await Service.findById(serviceId);
        const id = await Service.findOne({serviceName:serviceId},{ _id:1 });
        console.log(id);
        const serviceDocument = await Service.findById(id);
        console.log(id)
        if (!serviceDocument) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Add provider ID to the service
        if (serviceDocument.serviceProviderId.includes(providerId)) {
            return res.send({ status: "error", data: "Provider exists" });
        }
        serviceDocument.serviceProviderId.push(providerId) ; 
         await serviceDocument.save(); 

        return res.status(200).json({ message: 'Service provider added successfully', serviceDocument });
    } catch (error) {
        console.error('Error adding service provider:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
});


app.get('/getProviders', async(req, res)=>{

    const { serviceId } = req.query;

    try {
        // Find the service by its ID and populate the serviceProviderId field
        const service = await Service.findById(serviceId)
            .populate({
                path:'serviceProviderId',
                select: '_id name email mobile'
            });

        if (!service) {
            return res.status(404).send('Service not found');
        }

        console.log('Service with Users:', service);
        // return service;
        res.send(service);

    } catch (error) {
        console.error('Error fetching service:', error);
        throw error;
    }

})
// async function getServiceWithUsers(serviceId) {
    

// // Example usage
// const serviceId = '66f5530d3c0762bf66850739'; // Replace with actual service ID
// getServiceWithUsers(serviceId);


app.get('/getCategories', async (req, res) =>{
    try{
        const data = await Service.find({});
        console.log(data);
        res.send(data);
    }catch(error){
        console.log("error: ", error);
    }
})

app.post('/newBooking', async (req, res) =>{
    const { serviceId, providerId, customerId, scheduled_Date, scheduledTime } = req.body;

    let scheduledDate = '';
    if(scheduled_Date){
        scheduledDate = scheduledDate.split('T')[0];
    }
    console.log('scheduled date is: ',scheduledDate);
    try{
        await Booking.create({
            serviceId,
            providerId,
            customerId,
            scheduledDate,
            scheduledTime
        });
        res.send({ status: 'ok', data:'Booking added'})
    }catch(error){
        console.log(error)
    }
})


app.get('/bookingData/:userId', async(req, res)=>{
    const { userId } = req.params;
    console.log(userId);

    try{

        const user = await User.findOne({_id:userId}, {_id:0, role:1});

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(user.role);
        userRole = user.role;

        if(userRole === 'Customer'){
            const bookings = await Booking.find({ customerId: userId })
            .select('status scheduledDate scheduledTime')
            .populate({
                path:'providerId',
                select: 'name email role'
            });

            console.log(bookings);

            res.json(bookings);
        }else if(userRole === 'ServiceProvider'){
            const bookings = await Booking.find({ providerId: userId })
            .select('status scheduledDate scheduledTime')
            .populate({
                path:'customerId',
                select: 'name email role'
            });

            console.log(bookings);

            res.json(bookings);
        }

    }catch(error){
        console.log('booking error:', error)
    }
})

app.patch('/updateBookingStatus/:id/userResponse', async (req, res)=> {
    const { userResponse } = req.body;

    if (!['confirmed', 'canceled', 'declined'].includes(userResponse)) {
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

        res.status(200).json({ message: 'Booking status updated successfully.', booking });
    
    }catch(error){
        console.log("booking status update error: ", error);
    }
})


app.listen(4021, ()=>{
    console.log('Server is running')
})
