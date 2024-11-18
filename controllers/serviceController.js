const Service = require('../models/Service');  


exports.newService = async (req, res) => { 

    const { serviceName, description, category, price } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!imagePath) {
        return res.status(400).send({ error: 'Image upload failed.' });
    }

    try{
        await Service.create({
            serviceName:serviceName,
            description,
            category:category,
            serviceImage: imagePath,
            price: price
        });
        res.send({ status: 'ok', data:'Service added'})

    }catch(error){
        return res.send({ error: error });
    }
}; 
 
exports.getServicesAd = async (req, res) => { 
    try{
        const data = await Service.find({});
        const count = data.length;
        res.send({status: 'ok', data: data, count})
    }catch(error){
        return res.send({ error: error });
    }
}; 

exports.getServices = async (req, res) => { 
    const { category } = req.query;
    try{
        const data = await Service.find({category});
        res.send({status: 'ok', data: data})
    }catch(error){
        return res.send({ error: error });
    }
}; 
 
exports.services = async (req, res)=>{
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
}

exports.addProvidersIntoServices = async (req, res) => {
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
}


exports.getProviders = async(req, res)=>{

    const { serviceId } = req.query;

    try {
        // Find the service by its ID and populate the serviceProviderId field
        const service = await Service.findById(serviceId)
            .select(
                'serviceImage'
            )
            .populate({
                path:'serviceProviderId',
                select: '_id name email mobile profileImage providerDetails'
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
}

exports.getCategories = async (req, res) =>{
    try{
        const data = await Service.find({});
        console.log(data);
        res.send(data);
    }catch(error){
        console.log("error: ", error);
    }
}

exports.getServicesByProviders = async (req, res)=>{
    const {id} = req.query;
    try{
        const data = await Service.find({ serviceProviderId:id});
        console.log(data)
        res.send(data);
    }catch(error){
        console.log('getServicesByProviders error: ', error)
    }
}

exports.deleteService = async (req, res)=>{
    const {id} = req.query;

    try{
        await Service.findByIdAndDelete(id);
        res.send({status: 'ok', data: 'Service-deleted'});
    }catch(error){
        console.log('deleting error: ',error)
    }
}

exports.updateService = async ( req, res ) => {
    console.log(req.body)
    const { serviceId, serviceName, description, category, price } = req.body;
   
    const imagePath = req.file ? req.file.path : null;

    if (!serviceId) {
        return res.status(400).send({ error: 'service updating failed.' });
    }
    console.log(serviceId);

    try{
        const doc = await Service.findById(serviceId);
        console.log(doc);

        const updatedService = await Service.findByIdAndUpdate(serviceId, {
            serviceName,
            description,
            category,
            serviceImage: imagePath,
            price
        }, { new: true });

        if (!updatedService) {
            return res.status(404).send({ error: 'Service not found.' });
        }

        res.send({ status: 'ok', data: updatedService });

    }catch(error){
        return res.send({ error: error });
    }

}


// exports.uploadImage = async (req, res) => {
//     try {
//         await Service({ imagePath: req.file.path });
//         res.status(201).json({ message: 'Image uploaded successfully', path: req.file.path });
//     } catch (error) {
//         res.status(500).json({ message: 'Image upload failed', error });
//     }
// }