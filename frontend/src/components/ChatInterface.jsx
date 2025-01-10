import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { ShopContext } from "../context/ShopContext";

const ChatInterface = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chatbotData, setChatbotData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { backendUrl, userData } = useContext(ShopContext);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Simulate initial greeting when chat opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const userName = userData?.name || 'Guest';
            simulateTyping(`Hi ${userName}! 👋 I'm your shopping assistant. How can I help you today?`);
        }
    }, [isOpen]);

    const simulateTyping = async (message) => {
        setIsTyping(true);
        const delay = Math.random() * 1000 + 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        setMessages(prev => [...prev, { text: message, sender: 'bot' }]);
        setIsTyping(false);
    };

    const toggleChat = () => {
        if (!isOpen) {
            fetchChatbotData();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        setIsOpen(!isOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const userMessage = inputMessage.trim();
            setInputMessage('');
            setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

            // Find exact or similar question match
            const exactMatch = chatbotData.find(item =>
                item.question.toLowerCase() === userMessage.toLowerCase()
            );

            const similarMatch = chatbotData.find(item =>
                item.question.toLowerCase().includes(userMessage.toLowerCase()) ||
                userMessage.toLowerCase().includes(item.question.toLowerCase())
            );

            // Generate contextual responses
            let response;
            if (exactMatch) {
                response = exactMatch.answer;
            } else if (similarMatch) {
                response = `I think this might help: ${similarMatch.answer}`;
            } else if (userMessage.toLowerCase().includes('thank')) {
                response = "You're welcome! Let me know if you need anything else! 😊";
            } else if (userMessage.toLowerCase().includes('bye')) {
                response = "Goodbye! Have a great day! 👋";
            } else if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
                response = `Hello! How can I assist you today? 😊`;
            } else {
                response = "I'm not sure about that, but I'd be happy to help you with our products, orders, or general shopping questions. Feel free to ask anything specific! 🛍️";
            }

            await simulateTyping(response);
        }
    };

    const handleQuestionClick = async (question) => {
        setMessages(prev => [...prev, { text: question, sender: 'user' }]);
        const answer = chatbotData.find(item => item.question === question)?.answer;
        await simulateTyping(answer);
    };

    const fetchChatbotData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/chatbot/get-prompt`);
            if (response.data.success) {
                setChatbotData(response.data.questionsAndAnswers);
            } else {
                console.error('Failed to load chatbot data');
            }
        } catch (error) {
            console.error('Error fetching chatbot data:', error);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    return (
        <div>
            {!isOpen && (
                <div
                    className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-full cursor-pointer shadow-lg fixed bottom-4 right-4 transition-transform transform hover:scale-110 animate-bounce"
                    onClick={toggleChat}
                    role="button"
                    aria-label="Toggle chat"
                >
                    <span className="text-2xl">💬</span>
                </div>
            )}

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40" onClick={toggleChat}></div>

                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white rounded-lg shadow-xl border border-gray-300 z-50 overflow-hidden transition-transform duration-500">
                        {/* Chat Header */}
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <h4 className="text-lg font-semibold">Shopping Assistant</h4>
                            </div>
                            <button
                                className="text-white hover:text-gray-200 text-xl"
                                onClick={toggleChat}
                                aria-label="Close chat"
                            >
                                ✖
                            </button>
                        </div>

                        {/* Suggested Questions */}
                        <div className="px-4 py-0.5 bg-gray-50 border-b border-gray-300">
                            <p className="text-sm text-gray-600 mb-1.5">Suggested questions:</p>
                            <div className="flex flex-wrap gap-1">
                                {chatbotData.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuestionClick(item.question)}
                                        className="px-3 py-1.5 text-sm bg-white border border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300"
                                    >
                                        {item.question}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="p-4 bg-white h-60 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-center space-x-2 p-3 bg-gray-100 text-gray-500 rounded-lg w-20">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t border-gray-300">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    ref={inputRef}
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[calc(100%-3rem)]"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!inputMessage.trim() || isTyping}
                                >
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        transform="rotate(90)"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>


                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatInterface;