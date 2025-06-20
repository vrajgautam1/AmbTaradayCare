const express = require("express")
const app = express()
const db = require("./config/dbconnection")
const apiRouter = require("./routers/index")
const bodyParser = require("body-parser")
const path = require("path")
const multer = require("multer");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({extended:true}))

//-for adding files in the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
//-static files
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(apiRouter)

const port = process.env.PORT || 3000
app.listen(port, (err)=>{
    if(!err){
        db()
        console.log("server is running")
        console.log("http://localhost:"+port)
    }
})