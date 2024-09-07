import jwt from 'jsonwebtoken'
const JWT_SECRET = 'thisisastring';

const fetchUser = (req, res, next) => {
    // get user from jwt token and add id to request object
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        res.send(401).send({ error: 'Please authenticate using a valid token' })
    }
}

export default fetchUser