
const mongoose=require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/khaatabookProject")

const db=mongoose.connection;

// db.on('error',function(err) {
//    console.log("error occur");
    
// })

// db.on('open',function(){
//     console.log("connected");
// })
module.exports=db;