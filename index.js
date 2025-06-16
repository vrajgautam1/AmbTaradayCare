const express = require("express")
const app = express()
const db = require("./config/dbconnection")
const apiRouter = require("./routers/index")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiRouter)


const port = process.env.PORT || 3000
app.listen(port, (err)=>{
    if(!err){
        db()
        console.log("server is running")
        console.log("http://localhost:"+port)
    }
})