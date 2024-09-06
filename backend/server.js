import express from 'express'; // Import express to create and manage the server
import connectToMongo from './db.js'; // Import the function to connect to MongoDB
import { authRouter } from './routes/auth.js'; // Import the authentication routes

// Connect to MongoDB using the function defined in db.js
connectToMongo();

const app = express(); // Initialize the express application
const port = 8000; // Define the port the server will listen on

// Middleware to parse incoming JSON requests
app.use(express.json());

// Route middleware to handle requests to the '/api/auth' endpoint using authRouter
app.use('/api/auth', authRouter);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running at port ${port}`); // Log a message when the server starts
});
