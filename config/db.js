const mongoose = require('mongoose'); 
require('dotenv').config();
const mongourl = process.env.mongoURL

mongoose.connect(mongourl)
.then(()=>{
    console.log('DB connected')
})
.catch((e)=>{
    console.log(e)
})