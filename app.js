const express = require('express')
const app = express();
const bodyParser=require('body-parser')
const path=require('path')
const connectDB=require('./config/mongoose')
const user=require('./models/user')


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.set("view engine","ejs");


//routes

//render signup page
app.get('/signup',(req,res)=>{
res.render('signup')
})

//handle signup form submission (post method)

app.post('/signup',async(req,res)=>{

   const {username,password}=req.body;

   //check if the user is already exists

   const existingUser= await user.findOne({username});

   if(existingUser){
    return res.send('user already exixts.please try again')
   }

   //create a new user and save to the database
   const newUser=user.create({username,password});
   
   res.redirect('/login')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.listen(3000);