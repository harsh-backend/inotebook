import express from 'express'; // Import express to create routers and handle HTTP requests
import User from '../models/UserModel.js'; // Import the User model for database interaction
import { body, validationResult } from 'express-validator'; // Import validation and error handling methods from express-validator
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import jwt from 'jsonwebtoken'; // Import jwt to generate JSON Web Tokens for authentication
import fetchUser from '../middlewares/fetchUser.js';

// JWT secret key used for signing tokens
const JWT_SECRET = 'thisisastring';

export const authRouter = express.Router(); // Create a router for handling authentication-related routes

// Route 1 - create a new user using: POST "api/auth/createuser", no login required
authRouter.post('/createuser', [
    // Validate the 'name' field to ensure it has at least 3 characters
    body('name', 'Name must be 3 or more letters').isLength({ min: 3 }),
    // Validate the 'email' field to ensure it's a valid email address
    body('email', 'Enter a valid email').isEmail(),
    // Validate the 'password' field to ensure it has at least 6 characters
    body('password', 'Password must be at least 6 characters long.').isLength({ min: 6 })
], async (req, res) => {

    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If errors exist, send a 400 Bad Request response with the errors
        return res.status(400).json({ errors: errors.array() });
    }

    // Try block to handle any potential errors during database interaction
    try {
        // Check if a user with the same email already exists in the database
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            // If the user exists, send a 400 Bad Request response with an error message
            return res.status(400).json({ error: "A user with this email already exists" });
        }

        // Generate a salt for hashing the password
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt to secure it before saving
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user object and save it to the database
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass // Store the hashed password in the database
        });

        // Prepare a payload with the user's ID to include in the JWT token
        const data = {
            user: {
                id: user.id
            }
        };

        // Generate a JWT token using the user's ID and the secret key
        const authToken = jwt.sign(data, JWT_SECRET);

        // Send the auth token in the response as a sign of successful registration
        res.json({ authToken });
    } catch (error) {
        // Log any error that occurs to the console
        console.log(error.message);
        // Send a 500 Internal Server Error response in case of server errors
        res.status(500).send('Internal server error');
    }
});

// Route 2 - authenticate a user using: POST "api/auth/login"
authRouter.post('/login', [
    // Validate the 'email' field to ensure it's a valid email address
    body('email', 'Enter a valid email').isEmail(),
    // Validate the 'password' field to ensure it exists and is not blank
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If errors exist, send a 400 Bad Request response with the errors
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure email and password from the request body
    const { email, password } = req.body;

    try {
        // Find a user by their email address in the database
        let user = await User.findOne({ email });
        if (!user) {
            // If the user does not exist, send a 400 Bad Request response with an error message
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare the provided password with the stored hashed password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            // If the password does not match, send a 400 Bad Request response with an error message
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Prepare a payload with the user's ID to include in the JWT token
        const data = {
            user: {
                id: user.id
            }
        };

        // Generate a JWT token using the user's ID and the secret key
        const authToken = jwt.sign(data, JWT_SECRET);

        // Send a success message along with the auth token in the response
        res.json({ message: 'Logged in successfully', authToken });
    } catch (error) {
        // Log any error that occurs to the console
        console.log(error.message);
        // Send a 500 Internal Server Error response in case of server errors
        res.status(500).send('Internal server error');
    }
});

// Route 3 - get user details
authRouter.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findOne({userId}).select('-password')
        res.send(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal server error')
    }
})