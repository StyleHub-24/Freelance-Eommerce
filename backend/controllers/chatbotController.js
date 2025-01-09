import Chatbot from '../models/chatbotModel.js'; // Import the chatbot model

// Function to replace chatbot questions and answers
const addPrompt = async (req, res) => {
    try {
        const { questionsAndAnswers } = req.body;

        if (!questionsAndAnswers || !Array.isArray(questionsAndAnswers)) {
            return res.status(400).json({ success: false, message: 'Invalid data format. questionsAndAnswers must be an array.' });
        }

        // Find the existing chatbot document or create a new one
        let chatbot = await Chatbot.findOne();

        if (!chatbot) {
            // Create a new document if none exists
            chatbot = new Chatbot({ questionsAndAnswers });
        } else {
            // Replace the existing questionsAndAnswers with the new data
            chatbot.questionsAndAnswers = questionsAndAnswers;
        }

        // Save the updated chatbot data
        await chatbot.save();

        res.json({ success: true, message: 'Questions and answers updated successfully!', chatbot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating questions and answers' });
    }
};

// Function to get chatbot questions and answers
const getPrompt = async (req, res) => {
    try {
        // Fetch the chatbot data (assuming only one document in the collection)
        const chatbotData = await Chatbot.findOne();

        // If no data exists, return an empty array
        if (!chatbotData) {
            return res.json({ success: true, questionsAndAnswers: [] });
        }

        res.json({ success: true, questionsAndAnswers: chatbotData.questionsAndAnswers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching chatbot questions and answers' });
    }
};

export { addPrompt, getPrompt };
