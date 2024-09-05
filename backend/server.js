import express from 'express';
import connectToMongo from './db.js';
import { authRouter } from './routes/auth.js';

// connect to MongoDB
connectToMongo();

const app = express();
const port = 8000;

// middleware to parse json
app.use(express.json());

// routes
app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});
