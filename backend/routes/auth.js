import express from 'express';
import User from '../models/UserModel.js';
import { body, validationResult } from 'express-validator'

export const authRouter = express.Router();

// create a user using: POST "api/auth", no login required
authRouter.post('/createuser', [
    body('name', 'Name must be 3 or more than letters').isLength({ min: 3 }),
    body('email', 'Enter a valid name').isEmail(),
    body('password', 'Password must be more that 6 or more than six letters.').isLength({ min: 6 })
], async (req, res) => {

    // if errors, return bad request and errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // check whether the user with email exists already
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "user with this particular emial already exists" })
        }

        // creating a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.json({ user })
    } catch (error) {
        console.log(error.message)
        res.status(500).send('there is an error')
    }
})
