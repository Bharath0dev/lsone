const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const nodemailer = require("nodemailer");
 
const JWT_SECRET = "aSecret"; 
const emailPass = "zcho znyl yrhj kyrx";
 
exports.register = async (req, res) => { 
    const { name, email, mobile, password, role }=req.body;
    

    const oldUser= await User.findOne({email:email})

    if(oldUser){
        return res.send({ data: 'User already exist'});
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    try{
        if(role == 'Customer'){
            await User.create({
                name:name,
                email:email,
                mobile,
                password: encryptedPassword,
                role,
                accountStatus: 'active',
            });
        }
        else if(role == 'ServiceProvider'){
            await User.create({
                name:name,
                email:email,
                mobile,
                password: encryptedPassword,
                role,
                accountStatus: 'inactive',
            });
        }
        
        res.send({status:'ok', data: 'user created'})
    }catch(error){
        res.send({ status:'error', data: error})
    }
}; 
 
exports.login = async (req, res) => { 
    const {email, password} = req.body;
    console.log(req.body);
    const oldUser = await User.findOne({ email: email });

    if(!oldUser){
        return res.send({data: "User doesn't exist", status: 'No-User'});
    }

    if(await bcrypt.compare(password, oldUser.password)){
        const token = jwt.sign({email:oldUser.email}, JWT_SECRET);

        if(oldUser.accountStatus){
            return res.send({ status: 'ok', data: token, role: oldUser.role, userId: oldUser._id, accountStatus: oldUser.accountStatus, userEmail: oldUser.email });
        }else{
            return res.send({ status: 'ok', data: token, role: oldUser.role, userId: oldUser._id, userEmail: oldUser.email });
        }
    }
    else{
        return res.send({ status: "error" });
    }
}; 

 
exports.userData = async (req, res) => { 
    const { token, userId } = req.body;

    try{
        const user = jwt.verify(token, JWT_SECRET);
        const useremail = user.email;

        const data = await User.findOne({email: useremail})

        return res.send({ status: 'ok', data: data});
        
    }catch(error){
        return res.send({error: error});
    }
}; 
 

const generateRandomNumber = () => { 
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to send an email
const sendEmailNotification = async (userEmail, emailOTP) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "lsoneproject@gmail.com",
            pass: emailPass, 
        },
    });

    const mailOptions = {
        from: "lsoneproject@gmail.com",
        to: userEmail,
        subject: "OTP from LocalServe",
        text: `Your OTP is: ${emailOTP}`, // Message body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error(`Error sending email to ${userEmail}: ${error.message}`);
    }
};

exports.emailVerification = async (req, res) => {
    const { email } = req.query;
    console.log(email);
    try {
        const userEmail = await User.findOne({ email });
        if (!userEmail) {
            return res.status(404).send({ message: 'User not found' });
        }

        const emailOTP = generateRandomNumber();
        await sendEmailNotification(email, emailOTP);

        res.send({ status: 'ok', message: 'OTP sent to email', emailOTP: emailOTP });

    } catch (error) {
        console.log('Error while checking email:', error);
        res.status(500).send({ message: 'Internal server error' });
    }

}

exports.updatePassword = async (req, res) => {
    const { password, email } = req.body;
    console.log(email, password);

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.send({data: "User doesn't exist"});
        }

        const encryptedPassword = await bcrypt.hash(password, 10)

        await User.updateOne(
            { email: email },
            {
                $set: {
                   password: encryptedPassword
                },
            }
        )
        res.send({message: 'password updated successfully', status: 'ok'});
    }catch(error){
        console.log('error while updating the password-',error)
    }
}