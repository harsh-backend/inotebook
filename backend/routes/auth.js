import express from 'express';
import UserModel from '../models/UserModel.js';

export const authRouter = express.Router();

// create a user using: POST "api/auth"
authRouter.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please include name, email, and password.' });
        }

        // create a new user
        const user = new UserModel({ name, email, password });

        // save the user to the database
        await user.save();

        // Return the saved user name and email
        return res.status(201).json({ message: 'User created successfully', user: { name, email } });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
