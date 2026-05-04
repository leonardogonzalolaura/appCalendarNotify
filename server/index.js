import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { signup, login, googleLogin } from './auth.js';
import routes from './routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/signup', signup);
app.post('/api/auth/login', login);
app.post('/api/auth/google', googleLogin);

// Protected routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
