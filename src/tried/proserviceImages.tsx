exports.updateUser = async (req, res) => { 

    const { name, email, mobile, role, address, city, zipcode } = req.body;

    const profileImagePath = req.files.image ? req.files.image[0].path : null;
    const serviceImages = req.files['providerServiceImages'] || [];

    const existingUser = await User.findOne({ email: email });
    const currentProfileImage = existingUser.profileImage;

    const finalProfileImagePath = profileImagePath || currentProfileImage;

    console.log(req.body);

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
                    'location.address': address, 
                    'location.city': city, 
                    'location.zip': zipcode, 
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
                await User.updateOne({
                    email: email
                },{
                    $set: {
                        name, 
                        mobile, 
                        email, 
                        role, 
                        'location.address': address, 
                        'location.city': city, 
                        'location.zip': zipcode,
                        profileImage: finalProfileImagePath,
                    },
                });
            }
        }

        res.send({ status: 'ok', data: 'updated' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error });
    }
};
