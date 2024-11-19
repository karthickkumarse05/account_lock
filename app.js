const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use('/api', authRoutes)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
    } catch (error) {
        console.log(error);
    }
}
start()

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})
