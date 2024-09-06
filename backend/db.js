import mongoose from 'mongoose'; // Import mongoose to interact with MongoDB

// MongoDB connection URI pointing to the local instance and 'inotebook' database
const mongoURI = 'mongodb://localhost:27017/inotebook';

// Function to connect to the MongoDB database
const connectToMongo = async () => {
    try {
        // Attempt to connect to the database using mongoose
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB'); // Log success message if connected
    } catch (error) {
        // Catch and log any errors that occur during the connection process
        console.error('Error connecting to MongoDB:', error);
    }
}

// Export the connectToMongo function for use in other files
export default connectToMongo;
