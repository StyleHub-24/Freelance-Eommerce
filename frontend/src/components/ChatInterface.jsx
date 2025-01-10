import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { ShopContext } from "../context/ShopContext";

const ChatInterface = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chatbotData, setChatbotData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const { backendUrl, userData } = useContext(ShopContext);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const toggleChat = () => {
        if (!isOpen) {
            fetchChatbotData();
            document.body.style.overflow = 'hidden'; // Disable scrolling
        } else {
            document.body.style.overflow = ''; // Re-enable scrolling
        }
        setIsOpen(!isOpen);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            handleSend(inputMessage);
            setInputMessage('');
        }
    };

    const handleSend = (message) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: message, sender: 'user' }
        ]);
        setIsLoading(true);

        setTimeout(() => {
            const response = chatbotData.find(item => item.question.toLowerCase() === message.toLowerCase() || item.question.toUpperCase() === message.toUpperCase() || item.question === message)?.answer || 'I am here to help! Please ask any question.';
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: response, sender: 'bot' }
            ]);
            setIsLoading(false);
        }, 1000);
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

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    return (
        <div>
            {!isOpen && (
                <div
                    className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full cursor-pointer shadow-lg fixed bottom-4 right-4 transition-transform transform hover:scale-110"
                    onClick={toggleChat}
                    role="button"
                    aria-label="Toggle chat"
                >
                    💬
                </div>
            )}

            {isOpen && (
                <>
                    {/* Background Overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40" onClick={toggleChat}></div>

                    {/* Chatbox */}
                    <div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white rounded-lg shadow-xl border border-gray-300 z-50 overflow-hidden transition-transform duration-500"
                    >
                        {/* Chat Header */}
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white">
                            <h4 className="text-base font-semibold">Chat with us</h4>
                            <button
                                className="text-white hover:text-gray-200"
                                onClick={toggleChat}
                                aria-label="Close chat"
                            >
                                ✖
                            </button>
                        </div>

                        {/* Chatbot Questions */}
                        <div className="p-3 bg-gray-50 border-b border-gray-300">
                        <p className="text-lg font-medium text-gray-700 mb-2">
                               👋🏼 Hello {userData?.name || 'Guest'}, how can we help?
                            </p>
                            <div
                                className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                                    chatbotData.length > 3 ? 'h-32 overflow-y-auto' : ''
                                }`}
                            >
                                {chatbotData.length === 0 ? (
                                    <div className="text-center text-gray-500">Loading questions...</div>
                                ) : (
                                    chatbotData.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSend(item.question)}
                                            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded shadow hover:bg-blue-200 transition-all duration-300"
                                        >
                                            {item.question}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="p-4 bg-white h-48 sm:h-56 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 p-2 rounded shadow-sm ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-100 text-blue-900 self-end ml-16'
                                            : 'bg-gray-100 text-gray-900 self-start mr-16'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start items-center space-x-1">
                                    <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce"></div>
                                    <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                    <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-400"></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-3 bg-gray-50 border-t border-gray-300">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    ref={inputRef}
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                    disabled={!inputMessage.trim()}
                                >
                                    Send
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
