import express from 'express';
import { addPrompt , getPrompt } from '../controllers/chatbotController.js';
import adminAuth from '../middleware/adminAuth.js';

const chatbotRouter = express.Router();

// Route to add chatbot questions and answers
chatbotRouter.post('/add-prompt',adminAuth, addPrompt);
chatbotRouter.get('/get-prompt', getPrompt);

export { chatbotRouter };
