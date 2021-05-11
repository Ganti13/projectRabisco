require('dotenv').config()

const express = require('express')
const cors = require('cors')
const router = require('./routes')

require('./database')

const app = express()
app.use(express.json())
app.use(cors())
app.use(router)



app.listen( process.env.PORT || 3333, ()=>{
    console.log('server is running')
})