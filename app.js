const Express = require('express');
var bodyParser= require('body-parser');

var request = require('request');

const Mongoose = require('mongoose');

var app=new Express();
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(Express.static(__dirname+"/public"));

const EmployeeModel=Mongoose.model("employeedetails",{ename:String,desig:String,sal:String,});

Mongoose.connect("mongodb://localhost:27017/employeedb");

app.get('/',(req,res)=>{
    res.render('form');
});

app.get('/getdatas',(req,res)=>{
    result = EmployeeModel.find( (error,data)=>{
         if(error){
             throw error;
         }
         else{
             res.send(data);
         }
     });
});

const getdataApi="http://localhost:3000/getdatas";

app.get('/views',(req,res)=>{
    request(getdataApi,(error,response,body)=>{
        var data=JSON.parse(body);
        console.log(data);
        res.render('employeeviews',{'data':data});
    });
});


app.post('/read',(req,res)=>{
    console.log(req.body);
    var employee= EmployeeModel(req.body);
    var result = employee.save( (error)=>{
        if(error){
            throw error;
            res.send(error);
        }
        else{
            res.send('user created');
        }
    });
});



app.listen(process.env.PORT || 3000,()=>{
    console.log("server running on port http://localhost:3000");
});