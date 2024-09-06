import express from 'express'; // Import express to create routers and handle HTTP requests
import User from '../models/UserModel.js'; // Import the User model for database interaction
import { body, validationResult } from 'express-validator'; // Import validation and error handling methods from express-validator
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import jwt from 'jsonwebtoken'; // Import jwt to generate JSON Web Tokens for authentication

// JWT secret key used for signing tokens
const JWT_SECRET = 'thisisastring';

export const authRouter = express.Router(); // Create a router for handling authentication-related routes

// Route to create a new user using: POST "api/auth", no login required
authRouter.post('/createuser', [
    // Validate the 'name' field to ensure it has at least 3 characters
    body('name', 'Name must be 3 or more letters').isLength({ min: 3 }),
    // Validate the 'email' field to ensure it's a valid email address
    body('email', 'Enter a valid email').isEmail(),
    // Validate the 'password' field to ensure it has at least 6 characters
    body('password', 'Password must be at least 6 characters long.').isLength({ min: 6 })
], async (req, res) => {

    // If validation errors exist, return a 400 Bad Request with the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Try to check if a user with the same email already exists in the database
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "A user with this email already exists" });
        }

        // Generate a salt for hashing the password
        const salt = await bcrypt.genSalt(10);
        // Hash the user's password with the salt
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user and save it to the database
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        // Prepare the payload with the user ID to generate an auth token
        const data = {
            user: {
                id: user.id
            }
        };

        // Generate a JWT token for the user using the secret key
        const authToken = jwt.sign(data, JWT_SECRET);

        // Send the auth token in the response
        res.json({ authToken });
    } catch (error) {
        console.log(error.message); // Log any error that occurs during user creation
        res.status(500).send('Internal server error'); // Send a 500 response for server errors
    }
});
