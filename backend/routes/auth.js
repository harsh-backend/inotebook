import express from 'express'

export const authRouter = express.Router()

authRouter.get('/', (req, res) => {
    const obj = {
        a: 'name',
        b: 34
    }
    res.json(obj)
})
