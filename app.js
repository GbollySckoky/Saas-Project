require('dotenv').config();
const express = require('express')
const app = express()

const port = process.env.PORT || 4000

const start = async () => {
    try{
        // await c
        app.listen(() => {
            console.log(`Server is listening on port ${port}...`)
        })
    }catch(error){
        console.log("ERROR!!!", error)
    }
}

start()