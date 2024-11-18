const mongoose = require('mongoose'); 

const mongourl = 'mongodb://localhost:27017/lsone';

mongoose.connect(mongourl)
.then(()=>{
    console.log('DB connected')
})
.catch((e)=>{
    console.log(e)
})