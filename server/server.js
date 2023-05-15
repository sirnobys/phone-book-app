const express = require('express')
const mongoose = require('mongoose')
const controllers = require('./endpoints/v1/phone_book/controllers')
const app = express()
app.use(express.json())

const port = process.env.ENV_PORT_NUMBER || 3000
const db_name = process.env.ENV_DB_NAME || 'contact'
const host_name = 'cluster0.lkv4x9y.mongodb.net'
const uri = `mongodb+srv://root:root@${host_name}/${db_name}?retryWrites=true&w=majority`

controllers(app)

mongoose.connect(uri)
.then(()=>{
    console.log('connected to database successfully');
    app.listen(port,()=>{
        console.log('running on port', port);
    })
}).catch((err)=>{
    console.log(err);
})