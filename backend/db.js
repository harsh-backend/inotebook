import mongoose from 'mongoose'
const mongoURI = 'mongodb://localhost:27017/inotebook'

// connecting to databse
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log('connected to mongodb')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}

export default connectToMongo
