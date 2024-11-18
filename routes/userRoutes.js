const express = require('express'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { updateUser, 
    getAllUsers, 
    getUserData, 
    getProviderData, 
    deleteUser, 
    deleteProviderServiceImage, 
    getProviderDetails, 
    getRegistrationRequests, 
    updateAccountStatus,
    updateOnHoldProviderData,
    deactivateUser,
    getCountforProviderScreen,
 } = require('../controllers/userController'); 
 
const router = express.Router(); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // Example: limit files to 5MB
}).fields([
    { name: 'image', maxCount: 1 }, // For profile image
    { name: 'providerServiceImages', maxCount: 10 } // For multiple service images
]);

router.post('/update', upload, updateUser); 
router.get('/get-all-user', getAllUsers); 
router.get('/get-user-data', getUserData);
router.get('/getProviderData', getProviderData);
// router.post('/delete-user', deleteUser)
router.patch('/deactivateUser', deactivateUser)
router.delete('/deleteProviderServiceImage', deleteProviderServiceImage)
router.get('/getProviderDetails', getProviderDetails);
router.get('/getRegistrationRequests', getRegistrationRequests);
router.patch('/updateAccountStatus', updateAccountStatus);
router.patch('/updateOnHoldProviderData', updateOnHoldProviderData);
router.get('/getCountforProviderScreen', getCountforProviderScreen);

module.exports = router; 
 