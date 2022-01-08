const path = require('path')
const express = require('express')
const hbs = require("hbs");
const forecast = require('./utils/forecast.js')
const geocode = require('./utils/geocode.js')

const app = express()
//setup paths
const publicDirPath = path.join(__dirname,'../public')
const templatesPath = path.join(__dirname,'../templates/views')
const partailsPath = path.join(__dirname,"../templates/partials")
//set up app configurations
app.set("view engine","hbs")
app.set("views",templatesPath)
hbs.registerPartials(partailsPath)

app.use(express.static(publicDirPath))

app.get('',(req,res)=>{
    res.render('index',
    {
        title:"Weather",
        name:"Mani Senju"
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:"About Me",
        name:"Mani Senju"
    })
})
app.get('/help',(req,res)=>{
    res.render('help',{
        title:"Help Page",
        name:"Mani Senju"
    })
})

app.get('/weather',(req,res)=>{
    const address = req.query.address
    if(!address){
        return res.send({
            error:"address is a must"
        })
    }
    
    geocode(address,(err,{latitude,longitude,location}={})=>{
        if(err){
            return res.send({
                error:err
            })
        }
        forecast(latitude,longitude,(err,{temperature,feelslike}={})=>{
            if(err){
                return res.send({
                    error:err
                })
            }
            res.send({
                forecast:"Temperature:"+temperature+" but feelslike "+feelslike,
                location:location,
                address:address
            })
        })
    }) 
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error:"search term is needed"
        })
    }
    res.send({
        products:[]
    })
})

app.get('/help/*',(req,res)=>{
    res.render("notFound",{
        title:"Help Page",
        name:"Mani Senju",
        error:"Help Page Articles not Found"
    })
})

app.get('*',(req,res)=>{
    res.render("notFound",{
        title:"Eror Page",
        name:"Mani Senju",
        error:"404 Not Found"
    })
})


app.listen(3000,()=>{
    console.log("Web Server is running on 3000 port")
})