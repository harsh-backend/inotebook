import connectToMongo from './db.js'
import express from 'express'

const app = express()
const port = 8000

app.get('/', (req, res) => {
    res.send('hello')
})

const startServer = async () => {
    try {
        await connectToMongo()
        app.listen(port, () => {
            console.log(`server is running at port ${port}`)
        })
    } catch (error) {
        console.log('Failed to connect to database :', error)
    }
}

startServer()