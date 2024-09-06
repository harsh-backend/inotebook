import express from 'express';
import User from '../models/UserModel.js';
import { body, validationResult } from 'express-validator'

export const authRouter = express.Router();

// create a user using: POST "api/auth"
authRouter.post('/', [
    body('name', 'Name must be 3 or more than letters').isLength({ min: 3 }),
    body('email', 'Enter a valid name').isEmail(),
    body('password', 'Password must be more that 6 or more than six letters.').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(User => res.json(User))
        .catch(err => {
            console.log(err)
            res.json({ error: 'Please enter a unique value', message: err.message })
        })
});
