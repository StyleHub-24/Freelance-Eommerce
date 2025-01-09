import mongoose from 'mongoose';

const chatbotSchema = new mongoose.Schema({
  questionsAndAnswers: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ],
  dateAdded: { type: Date, default: Date.now }
});

const Chatbot = mongoose.models.chatbot || mongoose.model('chatbot', chatbotSchema);

export default Chatbot;
